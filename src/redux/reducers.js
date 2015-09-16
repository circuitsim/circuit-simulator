import R from 'ramda';
import Vector from 'immutable-vector2d';

import addingComponentsReducer from './reducers/addingComponents.js';
import modesReducer from './reducers/modes.js';
import gameLoopReducers from './reducers/gameLoop.js';

import MODES from '../Modes.js';

import {
  MODE_ADD,
  MODE_ADDING,
  MODE_SELECT,
  CHANGE_MODE_BUTTON_CLICK,

  ADDING_START,
  ADDING_MOVE,
  ADDING_FINISH,

  COMPONENT_MOUSE_OVER,
  COMPONENT_MOUSE_OUT,

  LOOP_BEGIN,
  LOOP_UPDATE,

  SELECT_BUTTON,

  MOUSE_MOVED
} from './actions.js';

export const initialState = {
  mode: {
    type: MODES.select
  },

  mousePos: {},

  addingComponent: {},

  currentOffset: 0,

  // views: {
  //   id: {
  //     typeID,
  //     props: {
  //       id,
  //       connectors: [Vector]
  //     }
  //   }
  // }
  views: {},
  // hover: {
  //   viewID,
  //   connectorIndex
  // }
  hover: {},

  circuitChanged: false,
  error: false, // string | false

  selectedButton: 'select'
};

export default function simulatorReducer(state = initialState, action) {
  switch (action.type) {

  case MODE_ADD:
  case MODE_ADDING:
  case MODE_SELECT:
  case CHANGE_MODE_BUTTON_CLICK:
    return modesReducer(state, action);

  case ADDING_START:
  case ADDING_MOVE:
  case ADDING_FINISH:
    return addingComponentsReducer(state, action);


  case COMPONENT_MOUSE_OVER:
    return R.assocPath(['views', action.id, 'props', 'hover'], true, state);

  case COMPONENT_MOUSE_OUT:
    return R.assocPath(['views', action.id, 'props', 'hover'], false, state);


  case LOOP_BEGIN:
  case LOOP_UPDATE:
    return gameLoopReducers(state, action);


  case SELECT_BUTTON:
    return R.assoc('selectedButton', action.buttonID, state);

  case MOUSE_MOVED:
    return R.assoc('mousePos', Vector.fromObject(action.coords), state);

  default:
    return state;
  }
}
