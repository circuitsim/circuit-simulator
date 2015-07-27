import Immutable from 'immutable';
import {Elements} from 'circuit-diagram';

import EventProcessor from './EventProcessor.js';
import Modes from './Modes.js';
import Executor from './Executor.js';
import {getCircuitInfo, solveCircuit, updateCircuit} from './Solver.js';

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

function getCircuit(state) {
  return {
    nodes: state.get('nodes').toJS(),
    models: state.get('models').toJS()
  };
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
    nodes: new Immutable.Map(), // nodeID -> node
    error: undefined
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

    return {
      props: {
        elements: state.get('views'),
        pushEvent: event => eventQueue.push(event) // TODO make this into an external API for the rest of the app to use
      },
      context: {
        currentOffset: state.get('currentOffset'),
        circuitError: state.get('error')
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

      // solve the circuit
      const circuit = getCircuit(state);
      const circuitInfo = getCircuitInfo(circuit);
      const {solution, error} = solveCircuit(circuit, circuitInfo);
      state = updateCircuit(state, solution, circuitInfo);

      state = state.set('error', error);
    }
  }

  return {
    begin,
    update
  };
}

export default Updater;
