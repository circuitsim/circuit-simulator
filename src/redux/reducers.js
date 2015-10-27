import R from 'ramda';
import Vector from 'immutable-vector2d';

import addingComponentReducer from './reducers/addingComponent.js';
import moveComponentReducer from './reducers/moveComponent.js';
import modesReducer from './reducers/modes.js';
import mainLoopReducer from './reducers/mainLoop.js';
import selectComponentReducer from './reducers/selectComponent.js';
import deleteComponentReducer from './reducers/deleteComponent.js';
import mutateComponentReducer from './reducers/mutateComponent.js';
import { createVolts2RGB } from '../utils/volts2RGB.js';

import MODES from '../Modes.js';

import {
  MODE_ADD,
  MODE_ADDING,
  MODE_SELECT_MOVE,
  MODE_SELECT_MODE_MOUSEDOWN,
  MODE_MOVING,
  CHANGE_MODE_BUTTON_CLICK,

  SELECT_HOVERED_COMPONENT,
  UNSELECT_COMPONENT,

  ADDING_START,
  ADDING_MOVE,
  ADDING_FINISH,

  MOVING_START,
  MOVING_MOVE,
  MOVING_FINISH,

  LOOP_BEGIN,
  LOOP_UPDATE,

  MOUSE_MOVED,

  DELETE_COMPONENT,
  CHANGE_COMPONENT_VALUE
} from './actions.js';

export const initialState = {
  mode: {
    type: MODES.selectOrMove
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
  //     id,
  //     props: {
  //       dragPoints: [Vector], // 2 drag points
  //       connectors: [Vector],
  //
  //       value, // current|resistance etc.
  //
  //       // added by circuit analysis code
  //       // TODO consider splitting out?
  //       currents,
  //       voltages
  //     }
  //   }
  // }
  views: {},
  // hover: {
  //   viewID,
  //   dragPointIndex: number|false
  // }
  hover: {},

  // currently selected component
  selected: undefined,

  // maxVoltage: 5, TODO
  volts2RGB: createVolts2RGB(5),

  circuitChanged: false,
  error: false // string | false
};

export default function simulatorReducer(state = initialState, action) {
  switch (action.type) {

  case MODE_ADD:
  case MODE_ADDING:
  case MODE_SELECT_MOVE:
  case MODE_SELECT_MODE_MOUSEDOWN:
  case MODE_MOVING:
  case CHANGE_MODE_BUTTON_CLICK:
    return modesReducer(state, action);

  case UNSELECT_COMPONENT:
  case SELECT_HOVERED_COMPONENT:
    return selectComponentReducer(state, action);

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

  case MOUSE_MOVED:
    return R.assoc('mousePos', Vector.fromObject(action.coords), state);

  case DELETE_COMPONENT:
    return deleteComponentReducer(state, action);

  case CHANGE_COMPONENT_VALUE:
    return mutateComponentReducer(state, action);

  default:
    return state;
  }
}
