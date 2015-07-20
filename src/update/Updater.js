import Immutable from 'immutable';
import Analyser from 'circuit-analysis';
import {Functions} from 'circuit-models';
import R from 'ramda';

import EventProcessor from './EventProcessor.js';
import Modes from './Modes.js';
import Executor from './Executor.js';
import Wire from '../components/elements/Wire.jsx';

const {stamp} = Functions;

function viewModelChanged(state1, state2) {
  return state1.get('views') !== state2.get('views');
}

function toConnectors(elem) {
  const props = elem.get('props');
  return props
    .get('connectors')
    .map((vector, key) => ({
      pos: vector,
      id: {
        viewID: props.get('id'),
        connectorID: key
      }
    }));
}

function merge(connectors) {
  return connectors
    .reduce((nodeIDs, c) => {
      return nodeIDs.push(c.id);
    }, new Immutable.List());
}

function giveOrderedID(map, node, i) {
  return map.set(i, node);
}

function position(connector) { return connector.pos.toString(); }

function toNodes(views) {
  return views // withMutations?
    .valueSeq()
    .flatMap(toConnectors)
    .groupBy(position).valueSeq()
    .map(merge)
    .reduce(giveOrderedID, new Immutable.Map());
}

function setNodesInModels(models, nodes) {
  return models
    .withMutations(ms => {
      nodes.forEach((node, nodeID) => {
        node.forEach(connector => {
          ms.setIn([connector.viewID, 'nodes', connector.connectorID], nodeID);
        });
      });
    });
}

function getCircuitInfo(state) {
  return {
    numOfNodes: state.get('nodes').size,
    numOfVSources: state.get('models')
      .filter(m => m.has('vSources'))
      .reduce((n, m) => n + m.get('vSources'), 0)
  };
}

function solveCircuit(state, circuitInfo) {
  try {
    const {solve, stamp: stamper} = Analyser.createEquationBuilder(circuitInfo);
    state.get('models').forEach(model => {
      stamp(model, stamper);
    });
    const solution = solve();
    return {
      solution: R.flatten(solution())
    };
  } catch(e) {
    // if we can't solve, there's probably something wrong with the circuit
    console.warn(e);
    // just return a blank solution (zeros for voltages/currents)
    const n = Math.max(0, circuitInfo.numOfNodes + circuitInfo.numOfVSources - 1);
    return {
      solution: Array.fill(new Array(n), 0),
      error: e
    };
  }
}

function updateCircuit(state, solution, circuitInfo) {
  if (!solution) { return state; }

  const flattened = R.prepend(0, solution); // add 0 volt ground node

  const voltages = R.take(circuitInfo.numOfNodes, flattened);
  let currents = R.drop(circuitInfo.numOfNodes, flattened);

  return state.update('views', views => views.map(view => {
    const viewID = view.getIn(['props', 'id']);
    const model = state.getIn(['models', viewID]);
    const nodeIDs = model.get('nodes');

    // set voltages
    const vs = nodeIDs.map(nodeID => voltages[nodeID]);
    view = view.setIn(['props', 'voltages'], vs.toJS());

    // set currents
    const numOfVSources = model.get('vSources', 0);
    if (numOfVSources > 0) {
      const cs = R.take(numOfVSources, currents);
      currents = R.drop(numOfVSources, currents);
      view = view.setIn(['props', 'currents'], cs);
    }

    return view;
  }));
}

/**
 * Use BFS to find a path between two nodes in the circuit graph.
 */
function isPathBetween(startNode, destNode, nodes, models, modelID) {
  const visited = [],
        q = [];

  visited[startNode] = true;
  q.push(startNode);

  if (startNode === destNode) { return true; }

  while (q.length !== 0) {
    const n = q.shift();
    const connectors = nodes[n];

    // queue all directly connected nodes
    for (let i = 0; i < connectors.length; i++) {
      const con = connectors[i];
      const id = con.viewID;
      if (id === modelID) {
        continue; // ignore paths through the model
      }
      const connectedNodes = models[id].nodes;
      for (let j = 0; j < connectedNodes.length; j++) {
        const connectedNode = connectedNodes[j];
        if (connectedNode === destNode) {
          return true;
        }

        if (!visited[connectedNode]) {
          visited[connectedNode] = true;
          q.push(connectedNode);
        }
      }
    }
  }
  return false;
}

function hasPathProblem(state) {
  const models = state.get('models'),
        isCurrentSource = model => model.get('type') === 'CurrentSource',  // TODO make this less ugh
        hasPath = (currentSource, id) => {
          const nodes = state.get('nodes'),
                [n1, n2] = currentSource.get('nodes').toJS();
          return isPathBetween(n1, n2, nodes.toJS(), models.toJS(), id);
        };
  // look for current sources with no path for current
  return !models
    .filter(isCurrentSource)
    .every(hasPath);
}

function Updater() {
  const eventProcessor = new EventProcessor();
  const executor = new Executor();

  let eventQueue = new Immutable.List();
  let state = new Immutable.Map({
    mode: Modes.add(Wire),
    currentOffset: 0,
    // NOTE: Immutable.Maps are iterated in a stable order. This (for better of worse) is implicitly relied on
    views: new Immutable.Map(), // elemID -> element view
    models: new Immutable.Map(), // elemID -> element model
    nodes: new Immutable.Map() // nodeID -> node
  });

  function processEventQueue() {
    const {mode, actions} = eventProcessor.process(eventQueue, state.get('mode'));
    eventQueue = [];
    state = state.set('mode', mode);
    return actions;
  }

  // uses previous state + delta to calculate new props for CircuitCanvas
  function update(delta) {
    state = state.update('currentOffset', currentOffset => currentOffset += delta); // TODO a better way of doing this (and handling overflow)

    // TODO could do a lot of this in begin.viewModelChanged...
    const pathProblem = hasPathProblem(state);
    const circuitInfo = getCircuitInfo(state);
    const {solution, error} = solveCircuit(state, circuitInfo);
    state = updateCircuit(state, solution, circuitInfo);

    return {
      props: {
        elements: state.get('views'),
        pushEvent: event => eventQueue.push(event)
      },
      context: {
        currentOffset: state.get('currentOffset'),
        circuitError: error || pathProblem
      }
    };
  }

  function begin() {
    const actions = processEventQueue();
    const oldState = state;
    state = executor.executeAll(actions, oldState);
    if (viewModelChanged(state, oldState)) {
      // FIXME this will cause re-analysis even when hover-highlighting... could be better

      // create a graph of the circuit that we can use to analyse
      const nodes = toNodes(state.get('views'));
      const edges = setNodesInModels(state.get('models'), nodes);

      state = state.withMutations(s => {
        s.set('nodes', nodes).set('models', edges);
      });

    }
  }

  return {
    begin,
    update
  };
}

export default Updater;
