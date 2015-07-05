import Immutable from 'immutable';

import EventProcessor from './EventProcessor.js';
import Modes from './Modes.js';
import Executor from './Executor.js';
import Wire from '../components/elements/Wire.jsx';

const viewModelChanged = (state1, state2) => {
  return state1.get('elements') !== state2.get('elements');
};

const toConnectors = elem => {
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
};

const merge = connectors => {
  return connectors
    .reduce((nodeIDs, c) => {
      return nodeIDs.push(c.id);
    }, new Immutable.List());
};

const giveOrderedID = (map, node, i) => {
  return map.set(i, node);
};

const position = connector => connector.pos.toString();

const updateNodes = elements => elements // withMutations?
  .valueSeq()
  .flatMap(toConnectors)
  .groupBy(position).valueSeq()
  .map(merge)
  .reduce(giveOrderedID, new Immutable.Map());

const updateEdges = (models, nodes) => models
  .withMutations(ms => {
    nodes.forEach((node, nodeID) => {
      node.forEach(connector => {
        ms.setIn([connector.viewID, 'nodes', connector.connectorID], nodeID);
      });
    });
  });

export default function() {
  const eventProcessor = new EventProcessor();
  const executor = new Executor();

  let eventQueue = new Immutable.List();
  let state = new Immutable.Map({
    mode: Modes.add(Wire),
    currentOffset: 0,
    elements: new Immutable.Map(), // elemID -> element view
    models: new Immutable.Map(), // elemID -> element model
    nodes: new Immutable.Map() // nodeID -> node
  });

  const processEventQueue = () => {
    const {mode, actions} = eventProcessor.process(eventQueue, state.get('mode'));
    eventQueue = [];
    state = state.set('mode', mode);
    return actions;
  };

  // uses previous state + delta to calculate new props for CircuitCanvas
  const update = (delta) => {
    state = state.update('currentOffset', currentOffset => currentOffset += delta); // TODO a better way of doing this (and handling overflow)

    return {
      props: {
        elements: state.get('elements'),
        pushEvent: event => eventQueue.push(event)
      },
      context: {
        currentOffset: state.get('currentOffset')
      }
    };
  };

  const begin = () => {
    const actions = processEventQueue();
    const oldState = state;
    state = executor.executeAll(actions, oldState);
    if (viewModelChanged(state, oldState)) {
      // this will cause re-analysis even when hover-highlighting... could be better
      const nodes = updateNodes(state.get('elements'));
      const edges = updateEdges(state.get('models'), nodes);

      state = state.withMutations(s => {
        s.set('nodes', nodes).set('models', edges);
      });

      console.log('Updater - nodes:', nodes.toJS());
      console.log('Updater - element models:', edges.toJS());
    }
  };

  return {
    update,
    begin
  };
}
