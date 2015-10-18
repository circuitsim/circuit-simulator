import Vector from 'immutable-vector2d';

import MODES from '../Modes.js';

// Action types
export const MODE_SELECT_MOVE = 'MODE_SELECT_MOVE';
export const SELECT_COMPONENT = 'SELECT_COMPONENT';

export const MODE_SELECT_MODE_MOUSEDOWN = 'MODE_SELECT_MODE_MOUSEDOWN';
export const MODE_MOVING = 'MODE_MOVING';
export const MODE_ADD = 'MODE_ADD';
export const MODE_ADDING = 'MODE_ADDING';
export const CHANGE_MODE_BUTTON_CLICK = 'CHANGE_MODE_BUTTON_CLICK';

export const ADDING_START = 'ADDING_START';
export const ADDING_MOVE = 'ADDING_MOVE';
export const ADDING_FINISH = 'ADDING_FINISH';

export const MOVING_START = 'MOVING_START';
export const MOVING_MOVE = 'MOVING_MOVE';
export const MOVING_FINISH = 'MOVING_FINISH';

export const LOOP_BEGIN = 'LOOP_BEGIN';
export const LOOP_UPDATE = 'LOOP_UPDATE';

export const KEY_PRESS = 'KEY_PRESS';

export const MOUSE_MOVED = 'MOUSE_MOVED';

export const DELETE_COMPONENT = 'DELETE_COMPONENT';

// Action creators
export function canvasMouseDown(coords) {
  return function(dispatch, getState) {
    const { mode } = getState();

    switch (mode.type) {
    case MODES.add:
      dispatch({
        type: MODE_ADDING,
        typeID: mode.typeID
      });
      dispatch({
        type: ADDING_START,
        typeID: mode.typeID,
        coords
      });
      break;

    case MODES.selectOrMove:
      dispatch({
        type: MODE_SELECT_MODE_MOUSEDOWN
      });
      break;
    }
  };
}

export function canvasMouseMove(coords) {
  return function(dispatch, getState) {
    dispatch({
      type: MOUSE_MOVED,
      coords
    });

    const { mode, hover } = getState();
    switch (mode.type) {
    case MODES.adding:
      dispatch({
        type: ADDING_MOVE,
        coords
      });
      break;

    case MODES.selectOrMoveMouseDown:
      if (hover.viewID) {
        dispatch({
          type: MODE_MOVING
        });
        dispatch({
          type: MOVING_START,
          mouseVector: Vector.fromObject(coords)
        });
      }
      break;

    case MODES.moving:
      dispatch({
        type: MOVING_MOVE,
        mouseVector: Vector.fromObject(coords)
      });
      break;
    }
  };
}

export function canvasMouseUp(coords) {
  return function(dispatch, getState) {
    const { mode } = getState();
    switch (mode.type) {
    case MODES.adding:
      dispatch({
        type: MODE_ADD,
        typeID: mode.typeID
      });
      dispatch({
        type: ADDING_FINISH,
        coords
      });
      break;

    case MODES.selectOrMoveMouseDown:
      dispatch({
        type: MODE_SELECT_MOVE
      });
      dispatch({
        type: SELECT_COMPONENT,
        coords
      });
      break;

    case MODES.moving:
      dispatch({
        type: MODE_SELECT_MOVE
      });
      dispatch({
        type: MOVING_FINISH,
        mouseVector: Vector.fromObject(coords)
      });
      break;
    }
  };
}

export function loopBegin() {
  return {
    type: LOOP_BEGIN
  };
}

export function loopUpdate(delta) {
  return {
    type: LOOP_UPDATE,
    delta
  };
}

export function keyPress(key) {
  return {
    type: KEY_PRESS,
    key
  };
}

export function selectMode(buttonID) {
  return function(dispatch) {
    dispatch({
      type: CHANGE_MODE_BUTTON_CLICK,
      buttonID
    });
  };
}

export function deleteComponent(id) {
  return {
    type: DELETE_COMPONENT,
    id
  };
}
