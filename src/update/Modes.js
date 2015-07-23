import Immutable from 'immutable';

import handleHover from './handlers/HoverHandler.js';
import {handleStartAddFor, handleAdding, handleFinishAddFor} from './handlers/NewElementHandler.js';
import handleKeyPress from './handlers/KeyPressHandler.js';

// TODO think about modelling Modes as a state machine

const isNotNull = x => x !== null;

/**
 * Takes a lazy Seq of functions and input.
 * Returns the result of the first function not to return null,
 * or an empty object if no functions return a non-null value.
 */
const returnFirstResult = seq => input => {
  return seq
    .map(f => f(input))
    .filter(isNotNull)
    .first()
    || {};
};

// TODO make reusable code
const Modes = new Immutable.Record({

  add: (type) => {
    const handlers = [
      handleKeyPress,
      handleHover,
      handleStartAddFor(type)
    ];
    return {
      name: 'add ' + type.name,
      handle: returnFirstResult(new Immutable.Seq(handlers))
    };
  },

  adding: (type, id, coords) => {
    const handlers = [
      handleHover,
      handleAdding(type, id, coords),
      handleFinishAddFor(id, type)
    ];
    return {
      name: 'adding ' + type.name,
      handle: returnFirstResult(new Immutable.Seq(handlers))
    };
  }
});

export default new Modes();
