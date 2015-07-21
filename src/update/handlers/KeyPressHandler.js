import {EventTypes} from 'circuit-diagram';
import Modes from '../Modes.js';
import {KeyToElement} from '../../utils/KeyboardShortcuts.js';

// TODO this whole system is a bit of a mess, needs clearing up

const keyPressHandlers = {
  [EventTypes.KeyDown]: keys => ({
    mode: KeyToElement[keys] ? Modes.add(KeyToElement[keys]) : null
  })
};

export default event => { // TODO make a reusable version of this
  const handler = keyPressHandlers[event.type];
  return handler ? handler(event.keys) : null;
};
