import Vector from 'immutable-vector2d';

import MODES from '../Modes.js';

// Action types
export const MODE_MOVE = 'MODE_MOVE';
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

export const SELECT_BUTTON = 'SELECT_BUTTON';

export const MOUSE_MOVED = 'MOUSE_MOVED';

// Action creators
export function canvasMouseDown(coords) {
  return function(dispatch, getState) {
    const { mode, hover } = getState();

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

    case MODES.move:
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
    }
  };
}

export function canvasMouseMove(coords) {
  return function(dispatch, getState) {
    dispatch({
      type: MOUSE_MOVED,
      coords
    });

    const { mode } = getState();
    switch (mode.type) {
    case MODES.adding:
      dispatch({
        type: ADDING_MOVE,
        coords
      });
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

    case MODES.moving:
      dispatch({
        type: MODE_MOVE
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

export function componentSelectorButtonClicked(buttonID) {
  return function(dispatch) {
    dispatch({
      type: CHANGE_MODE_BUTTON_CLICK,
      buttonID
    });
    dispatch({
      type: SELECT_BUTTON,
      buttonID
    });
  };
}
