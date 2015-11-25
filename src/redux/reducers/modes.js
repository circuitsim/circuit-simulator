import R from 'ramda';
import CircuitComponents from '../../ui/diagram/components';

import MODES from '../../Modes';
import {
  CHANGE_MODE,
  CHANGE_MODE_BY_ID
} from '../actions';

const buttonIdToModeMap = {
  selectOrMove: {
    type: MODES.selectOrMove
  }
};

export default function modesReducer(
  mode = {
    type: MODES.selectOrMove,
    meta: {}
  },
  action
) {
  switch (action.type) {
  case CHANGE_MODE:
    return {
      type: action.name,
      meta: action.meta
    };

  case CHANGE_MODE_BY_ID: {
    const id = action.meta.id;
    const newMode = R.has(id, CircuitComponents)
      // if the id is a component type, then enter add mode
      ? {
        type: MODES.add,
        meta: {
          typeID: id
        }
      }
      // else look up the mode in the map
      : buttonIdToModeMap[id];
    return newMode;
  }

  default:
    return mode;
  }
}
