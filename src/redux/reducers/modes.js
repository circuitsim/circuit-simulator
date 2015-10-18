import R from 'ramda';
import CircuitComponents from '../../ui/diagram/components';

import MODES from '../../Modes.js';
import {
  MODE_ADD,
  MODE_ADDING,
  MODE_SELECT_MOVE,
  MODE_SELECT_MODE_MOUSEDOWN,
  MODE_MOVING,
  CHANGE_MODE_BUTTON_CLICK
} from '../actions.js';

const buttonIdToModeMap = {
  selectOrMove: {
    type: MODES.selectOrMove
  }
};

export default function modesReducer(state, action) {
  switch (action.type) {
  case MODE_ADD:
    return R.assoc('mode', {
      type: MODES.add,
      typeID: action.typeID
    }, state);

  case MODE_ADDING:
    return R.assoc('mode', {
      type: MODES.adding,
      typeID: action.typeID
    }, state);

  case MODE_SELECT_MOVE:
    return R.assoc('mode', {
      type: MODES.selectOrMove
    }, state);

  case MODE_SELECT_MODE_MOUSEDOWN:
    return R.assoc('mode', {
      type: MODES.selectOrMoveMouseDown
    }, state);

  case MODE_MOVING:
    return R.assoc('mode', {
      type: MODES.moving
    }, state);

  case CHANGE_MODE_BUTTON_CLICK: {
    const buttonID = action.buttonID;
    const mode = R.has(buttonID, CircuitComponents)
    // if the button ID is a component type, then enter add mode
      ? {
        type: MODES.add,
        typeID: buttonID
      }
    // else look up the mode in the map
      : buttonIdToModeMap[buttonID];
    return R.assoc('mode', mode, state);
  }

  default:
    return state;
  }
}
