import R from 'ramda';
import CircuitComponents from '../../ui/diagram/components';

import MODES from '../../Modes.js';
import {
  CHANGE_MODE,
  CHANGE_MODE_BY_ID
} from '../actions.js';

const buttonIdToModeMap = {
  selectOrMove: {
    type: MODES.selectOrMove
  }
};

export default function modesReducer(state, action) {
  switch (action.type) {
  case CHANGE_MODE:
    return R.assoc('mode', {
      type: action.name,
      meta: action.meta
    }, state);

  case CHANGE_MODE_BY_ID: {
    const id = action.meta.id;
    const mode = R.has(id, CircuitComponents)
      // if the id is a component type, then enter add mode
      ? {
        type: MODES.add,
        meta: {
          typeID: id
        }
      }
      // else look up the mode in the map
      : buttonIdToModeMap[id];
    return R.assoc('mode', mode, state);
  }

  default:
    return state;
  }
}
