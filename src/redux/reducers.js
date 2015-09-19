import R from 'ramda';
import Vector from 'immutable-vector2d';

import addingComponentReducer from './reducers/addingComponent.js';
import moveComponentReducer from './reducers/moveComponent.js';
import modesReducer from './reducers/modes.js';
import mainLoopReducer from './reducers/mainLoop.js';

import MODES from '../Modes.js';

import {
  MODE_ADD,
  MODE_ADDING,
  MODE_MOVE,
  MODE_MOVING,
  CHANGE_MODE_BUTTON_CLICK,

  ADDING_START,
  ADDING_MOVE,
  ADDING_FINISH,

  MOVING_START,
  MOVING_MOVE,
  MOVING_FINISH,

  LOOP_BEGIN,
  LOOP_UPDATE,

  SELECT_BUTTON,

  MOUSE_MOVED
} from './actions.js';

export const initialState = {
  mode: {
    type: MODES.move
  },

  mousePos: {},

  // addingComponent: {
  //   id,
  //   start: coords,
  //   typeID
  // }
  addingComponent: {},
  // movingComponent: {
  //   id,
  //   dragPointIndex: number|false,
  //   from: Vector,
  //   origDragPoints
  // }
  movingComponent: {},

  currentOffset: 0,

  // views: {
  //   id: {
  //     typeID,
  //     props: {
  //       id,
  //       dragPoints: [Vector], // 2 drag points
  //       connectors: [Vector]
  //     }
  //   }
  // }
  views: {},
  // hover: {
  //   viewID,
  //   dragPointIndex: number|false
  // }
  hover: {},

  circuitChanged: false,
  error: false, // string | false

  selectedButton: 'move'
};

export default function simulatorReducer(state = initialState, action) {
  switch (action.type) {

  case MODE_ADD:
  case MODE_ADDING:
  case MODE_MOVE:
  case MODE_MOVING:
  case CHANGE_MODE_BUTTON_CLICK:
    return modesReducer(state, action);

  case ADDING_START:
  case ADDING_MOVE:
  case ADDING_FINISH:
    return addingComponentReducer(state, action);

  case MOVING_START:
  case MOVING_MOVE:
  case MOVING_FINISH:
    return moveComponentReducer(state, action);

  case LOOP_BEGIN:
  case LOOP_UPDATE:
    return mainLoopReducer(state, action);

  case SELECT_BUTTON:
    return R.assoc('selectedButton', action.buttonID, state);

  case MOUSE_MOVED:
    return R.assoc('mousePos', Vector.fromObject(action.coords), state);

  default:
    return state;
  }
}
