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
  return props.get('connectors')
    .valueSeq()
    .map(vector => ({
      pos: vector,
      link: props.get('id')
    }));
};

const mergeLinks = connectors => {
  return connectors.reduce((cs, c) => {
    cs.links.push(c.link);
    return cs;
  }, {
    links: []
  });
};

const giveOrderedID = (node, i) => {
  return Object.assign({id: i}, node);
};

const position = connector => connector.pos.toString();

const updateModel = (views, models) => {

  const nodes = views
    .valueSeq()
    .flatMap(toConnectors)
    .groupBy(position)
    .map(mergeLinks).valueSeq()
    .map(giveOrderedID);

  // const links = models.

  // TODO tell each link which nodes it is connected to

  return {
    nodes,
    links
  };
};

export default function() {
  const eventProcessor = new EventProcessor();
  const executor = new Executor();

  let eventQueue = new Immutable.List();
  let state = new Immutable.Map({
    mode: Modes.add(Wire),
    currentOffset: 0,
    models: new Immutable.Map(), // elemID -> element model
    elements: new Immutable.Map(), // elemID -> element view
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
      const {nodes, links} = updateModel(state.get('elements'), state.get('models'));

      // TODO put updated nodes and links back into state

      console.log('Updater - pseudo nodes:', nodes.toJS());
      console.log('Updater - element models:', links.toJS());
    }
  };

  return {
    update,
    begin
  };
}
