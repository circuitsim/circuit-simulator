import EventTypes from '../EventTypes.js';
import Modes from '../Modes.js';
import KeyboardShortcuts from '../../components/utils/KeyboardShortcuts.js';

const keyPressHandlers = {
  [EventTypes.KeyPress]: (char) => ({
    mode: KeyboardShortcuts[char] ? Modes.add(KeyboardShortcuts[char]) : null
  })
};

export default event => { // TODO make a reusable version of this
  const handler = keyPressHandlers[event.type];
  return handler ? handler(event.char) : null;
};
