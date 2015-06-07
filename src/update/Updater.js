import {Map} from 'immutable';

// import Wire from './elements/Wire.jsx';
// import {relMouseCoords} from './utils/DrawingUtils.js';
// import KeyboardShortcuts from './utils/KeyboardShortcuts.js';
// import {AddElementActions} from '../actions/CircuitActions.js';
// import circuitStore from './stores/CircuitStore.js';
// import elementCreationStore from './stores/ElementCreationStore.js';

import EventProcessor from './EventProcessor.js';
import Modes from './Modes.js';
import Executor from './Executor.js';

// ---
import uuid from 'node-uuid';
import Vector from 'immutable-vector2d';
import Resistor from '../components/elements/Resistor.jsx';
import handleHover from '../components/HighlightOnHover.jsx';
// ---


// const startAddElement = (event, elementType) => {
//   const coords = relMouseCoords(event, canvasComponent);
//   AddElementActions.start(elementType, coords);
// };
//
// const moveElementConnector = (event) => {
//   const coords = relMouseCoords(event, canvasComponent);
//   AddElementActions.move(coords);
// };
//
// const finishAddElement = () => {
//   AddElementActions.finish();
// };

export default function() {
  let eventQueue = [];
  const eventProcessor = new EventProcessor();
  const executor = new Executor();
  this.getUpdateFor = (canvasComponent) => {

    // make immutable? though that doesn't seem to work: https://github.com/facebook/react/issues/2059
    let state = {
      canvasComponent,
      mode: Modes.default,
      currentOffset: 0,
      elements: new Map(), // elemID -> element
      addingElement: null
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
    state.elements = state.elements.set(initialElem.props.id, initialElem);

    // uses previous state + delta to calculate new props for CircuitCanvas
    const update = (delta) => {
      state.currentOffset += delta; // TODO a better way of doing this (and handling overflow)

      const {mode, commands} = eventProcessor.process(eventQueue, state.mode);
      eventQueue = [];
      state.mode = mode;

      state = executor.executeAll(commands, state);

      return {
        props: {
          elements: state.elements,
          pushEvent: (event) => { eventQueue.push(event); }
        },
        context: {
          currentOffset: state.currentOffset
        }
      };
    };
    return update;
  };
}
