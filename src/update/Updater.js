import Immutable from 'immutable';

import EventProcessor from './EventProcessor.js';
import Modes from './Modes.js';
import Executor from './Executor.js';

// --- TODO remove once code to add elements is removed
import uuid from 'node-uuid';
import Vector from 'immutable-vector2d';
import Resistor from '../components/elements/Resistor.jsx';
import handleHover from '../components/HighlightOnHover.jsx';
// ---

export default function() {
  let eventQueue = [];
  const eventProcessor = new EventProcessor();
  const executor = new Executor();
  this.getUpdateFor = (canvasComponent) => {

    let state = new Immutable.Map({
      canvasComponent,
      mode: Modes.default,
      currentOffset: 0,
      elements: new Immutable.Map(), // elemID -> element
      addingElement: null // TODO remove this, just use a known ID in elements?
    });

    const processEventQueue = () => {
      const {mode, actions} = eventProcessor.process(eventQueue, state.get('mode'));
      eventQueue = [];
      state = state.set('mode', mode);
      return actions;
    };

    // add initial element for hover testing
    const initialElem = {
        component: handleHover(Resistor),
        props: {
          id: uuid.v4(),
          connectors: Resistor.getConnectorPositions(
            new Vector(50, 50),
            new Vector(75, 75)
          )
        }
      };
    state = state.setIn(['elements', initialElem.props.id], initialElem);

    // uses previous state + delta to calculate new props for CircuitCanvas
    const update = (delta) => {
      state.currentOffset += delta; // TODO a better way of doing this (and handling overflow)

      const actions = processEventQueue();
      state = executor.executeAll(actions, state);

      const mutableState = state.toJS();

      const elems = mutableState.elements;
      const addingElem = mutableState.addingElement;
      if (addingElem) {
        elems[addingElem.props.id] = addingElem;
      }

      return {
        props: {
          elements: new Immutable.Map(elems),
          pushEvent: event => eventQueue.push(event)
        },
        context: {
          currentOffset: state.currentOffset
        }
      };
    };
    return update;
  };
}
