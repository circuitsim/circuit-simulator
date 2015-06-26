import Immutable from 'immutable';

import EventProcessor from './EventProcessor.js';
import Modes from './Modes.js';
import Executor from './Executor.js';
import Wire from '../components/elements/Wire.jsx';
import toModels from '../models/ModelMap.js';

const listConnectorVectors = connectorMap => {
  return Object.keys(connectorMap)
    .map(name => connectorMap[name]);
};

const toConnectors = elem => {
  return listConnectorVectors(elem.props.connectors)
    .map(vector => ({
      pos: vector,
      link: elem.props.id
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

const printModel = elements => {

  const elementModels = elements.map(toModels);

  const nodes = elements
    .valueSeq()
    .flatMap(toConnectors)
    .groupBy(position)
    .map(mergeLinks).valueSeq()
    .map(giveOrderedID);

  // TODO tell each model which nodes it is connected to
  // TODO we don't need to do this every update()
  //   the circuit model should be re-made only when the circuit changes
  //   we analyse() based on this model

  console.log('Updater - pseudo nodes:', nodes.toJS());
  console.log('Updater - element models:', elementModels.toJS());

};

export default function() {
  const eventProcessor = new EventProcessor();
  const executor = new Executor();

  let eventQueue = new Immutable.List();
  let state = new Immutable.Map({
    mode: Modes.add(Wire),
    currentOffset: 0,
    elements: new Immutable.Map() // elemID -> element
  });

  const processEventQueue = () => {
    const {mode, actions} = eventProcessor.process(eventQueue, state.get('mode'));
    eventQueue = [];
    state = state.set('mode', mode);
    return actions;
  };

  let i = state.get('elements').size; // DEBUG

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
    state = executor.executeAll(actions, state);

    // DEBUG
    if (i !== state.get('elements').size) {
      // printModel(state.get('elements'));
      i++;
    }
  };

  return {
    update,
    begin
  };
}
