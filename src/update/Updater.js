import Immutable from 'immutable';
import {Elements} from 'circuit-diagram';
import Analyser from 'circuit-analysis';
import {Functions} from 'circuit-models';
import R from 'ramda';

import EventProcessor from './EventProcessor.js';
import Modes from './Modes.js';
import Executor from './Executor.js';

const {stamp} = Functions;

const val = e => ({
  isIn(array) {
    return array.indexOf(e) !== -1;
  }
});

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

function blankSolution(circuitInfo) {
  // just return a blank solution (zeros for voltages/currents)
  const n = Math.max(0, circuitInfo.numOfNodes + circuitInfo.numOfVSources - 1);
  return Array.fill(new Array(n), 0);
}

/**
 * Use BFS to find a path between two nodes in the circuit graph.
 *
 * @param startNode - Node to begin searching from.
 * @param destNode - Node to find path to.
 * @param nodes - Nodes in the graph.
 * @param models - Edges of the graph.
 * @param opts - Extra options.
 * @param opts.exclude - Don't look for paths through models with these IDs.
 * @param opts.types - If defined, only look for paths through these types.
 */
function isPathBetween(
    startNode, destNode,
    nodes, models,
    {exclude, types} = {
      exclude: [],
      types: null
    }) {

  const visited = [],
        q = [];

  visited[startNode] = true;
  q.push(startNode);

  if (startNode === destNode) { return true; }

  while (q.length !== 0) {
    const n = q.shift();
    const connectors = nodes[n];

    for (let i = 0; i < connectors.length; i++) {
      const con = connectors[i];
      const id = con.viewID;
      if (val(id).isIn(exclude)) {
        continue; // ignore paths through excluded models
      } else if (types && !val(models[id].type).isIn(types)) {
        continue; // ignore paths that aren't through the given types
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
  const VOLT_SOURCES = ['VoltageSource', 'Wire'], // TODO make this less ugh - don't use magic strings!
        CURR_SOURCE = ['CurrentSource'],
        models = state.get('models'),
        isType = types => model => {
          return val(model.get('type')).isIn(types);
        },
        hasPathThrough = types => (component, id) => {
          const nodes = state.get('nodes').toJS(),
                modelsJS = models.toJS(),
                [node1, node2] = modelsJS[id].nodes;
          return isPathBetween(node1, node2, nodes, modelsJS, {
            exclude: [id], // exclude the component we're looking at
            types
          });
        },
        hasPath = hasPathThrough();
  return (
    // look for current sources with no path for current
    !models
      .filter(isType(CURR_SOURCE))
      .every(hasPath)
    ||
    // look for loops of voltage sources
    models
      .filter(isType(VOLT_SOURCES))
      .some(hasPathThrough(VOLT_SOURCES))
  );
}

function solveCircuit(state, circuitInfo) {
  const pathProblem = hasPathProblem(state);
  if (pathProblem) {
    console.error('path problem');
    // FIXME should use a descriptive error returned from hasPathProblem
    return {
      solution: blankSolution(circuitInfo),
      error: 'path problem'
    };
  }
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
    console.error(e);
    return {
      solution: blankSolution(circuitInfo),
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

function Updater() {
  const eventProcessor = new EventProcessor();
  const executor = new Executor();

  let eventQueue = new Immutable.List();
  let state = new Immutable.Map({
    mode: Modes.add(Elements.Wire),
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
    const circuitInfo = getCircuitInfo(state);
    const {solution, error} = solveCircuit(state, circuitInfo);
    state = updateCircuit(state, solution, circuitInfo);

    return {
      props: {
        elements: state.get('views'),
        pushEvent: event => eventQueue.push(event) // TODO make this into an external API for the rest of the app to use
      },
      context: {
        currentOffset: state.get('currentOffset'),
        circuitError: error
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
