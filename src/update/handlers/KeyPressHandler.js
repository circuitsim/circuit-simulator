import EventTypes from '../EventTypes.js';
import Modes from '../Modes.js';
import {KeyToElement} from '../../components/utils/KeyboardShortcuts.js';

const keyPressHandlers = {
  [EventTypes.KeyDown]: (keys) => ({
    mode: KeyToElement[keys] ? Modes.add(KeyToElement[keys]) : null
  })
};

export default event => { // TODO make a reusable version of this
  const handler = keyPressHandlers[event.type];
  return handler ? handler(event.keys) : null;
};
