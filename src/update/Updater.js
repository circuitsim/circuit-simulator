import Immutable from 'immutable';

import EventProcessor from './EventProcessor.js';
import Modes from './Modes.js';
import Executor from './Executor.js';
import Wire from '../components/elements/Wire.jsx';

export default function() {
  let eventQueue = [];
  const eventProcessor = new EventProcessor();
  const executor = new Executor();
  this.getUpdateFor = (canvasComponent) => {

    let state = new Immutable.Map({
      canvasComponent,
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

    // uses previous state + delta to calculate new props for CircuitCanvas
    const update = (delta) => {
      state = state.update('currentOffset', currentOffset => currentOffset += delta); // TODO a better way of doing this (and handling overflow)

      const actions = processEventQueue();
      state = executor.executeAll(actions, state);

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
    return update;
  };
}
