import Immutable from 'immutable';

import handleHover from './handlers/HoverHandler.js';
// import handleStartingAdd from './handlers/NewElementHandler.js';

// ModeMap :: ModeName: Handler
// Handler :: event => {mode, action} | null
const Modes = new Immutable.Map({
  default: [
      handleHover
    ]
});

const isNotNull = x => x !== null;

/**
 * Takes a lazy Seq of functions and input.
 * Returns the result of the first function not to return null,
 * or an empty object if no functions return a non-null value..
 */
const returnFirstResult = seq => input => {
  return seq
    .map(f => f(input))
    .filter(isNotNull)
    .first()
    || {};
};

export default Modes
  .map(handlers => new Immutable.Seq(handlers))
  .map(handlersSeq => returnFirstResult(handlersSeq))
  .toObject();
