import Immutable from 'immutable';

import EventProcessor from './EventProcessor.js';
import Modes from './Modes.js';
import Executor from './Executor.js';
import Wire from '../components/elements/Wire.jsx';

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

function updateEdges(models, nodes) {
  return models
    .withMutations(ms => {
      nodes.forEach((node, nodeID) => {
        node.forEach(connector => {
          ms.setIn([connector.viewID, 'nodes', connector.connectorID], nodeID);
        });
      });
    });
}

function Updater() {
  const eventProcessor = new EventProcessor();
  const executor = new Executor();

  let eventQueue = new Immutable.List();
  let state = new Immutable.Map({
    mode: Modes.add(Wire),
    currentOffset: 0,
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

    return {
      props: {
        elements: state.get('views'),
        pushEvent: event => eventQueue.push(event)
      },
      context: {
        currentOffset: state.get('currentOffset')
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
      const edges = updateEdges(state.get('models'), nodes);

      state = state.withMutations(s => {
        s.set('nodes', nodes).set('models', edges);
      });

      console.log('Updater - nodes:', nodes.toJS());
      console.log('Updater - element models:', edges.toJS());
    }
  }

  return {
    begin,
    update
  };
}

export default Updater;
