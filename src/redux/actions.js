import Vector from 'immutable-vector2d';
import uuid from 'node-uuid';

import MODES from '../Modes.js';

// Action types
export const CHANGE_MODE = 'CHANGE_MODE';
export const CHANGE_MODE_BY_ID = 'CHANGE_MODE_BY_ID';

export const SELECT_HOVERED_COMPONENT = 'SELECT_HOVERED_COMPONENT';
export const UNSELECT_COMPONENT = 'UNSELECT_COMPONENT';

export const ADDING_START = 'ADDING_START';
export const ADDING_MOVED = 'ADDING_MOVED';
export const ADDING_FINISH = 'ADDING_FINISH';

export const MOVING_START = 'MOVING_START';
export const MOVING_MOVED = 'MOVING_MOVED';
export const MOVING_FINISH = 'MOVING_FINISH';

export const LOOP_BEGIN = 'LOOP_BEGIN';
export const LOOP_UPDATE = 'LOOP_UPDATE';

export const KEY_PRESS = 'KEY_PRESS';

export const MOUSE_MOVED = 'MOUSE_MOVED';

export const DELETE_COMPONENT = 'DELETE_COMPONENT';
export const CHANGE_COMPONENT_VALUE = 'CHANGE_COMPONENT_VALUE';

export const SHOW_ADD_TOASTER = 'SHOW_ADD_TOASTER';
export const HIDE_ADD_TOASTER = 'HIDE_ADD_TOASTER';

// Action creators
export function canvasMouseEnter() {
  return function(dispatch, getState) {
    const { mode } = getState();

    switch (mode.type) {
    case MODES.add:
      dispatch({
        type: SHOW_ADD_TOASTER
      });
      break;
    }
  };
}

export function canvasMouseLeave() {
  return function(dispatch, getState) {
    const { mode } = getState();

    switch (mode.type) {
    case MODES.add:
      dispatch({
        type: HIDE_ADD_TOASTER
      });
      break;
    }
  };
}

export function canvasMouseDown(coords) {
  return function(dispatch, getState) {
    const { mode } = getState();

    switch (mode.type) {
    case MODES.add:
      dispatch({
        type: CHANGE_MODE,
        name: MODES.adding,
        meta: mode.meta
      });
      dispatch({
        type: ADDING_START,
        typeID: mode.meta.typeID,
        id: uuid.v4(),
        coords
      });
      break;

    case MODES.selectOrMove:
      dispatch({
        type: CHANGE_MODE,
        name: MODES.selectOrMoveMouseDown
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
        type: ADDING_MOVED,
        coords
      });
      break;

    case MODES.selectOrMoveMouseDown:
      if (hover.viewID) {
        dispatch({
          type: CHANGE_MODE,
          name: MODES.moving
        });
        dispatch({
          type: MOVING_START,
          mouseVector: Vector.fromObject(coords)
        });
      }
      break;

    case MODES.moving:
      dispatch({
        type: MOVING_MOVED,
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
        type: CHANGE_MODE,
        name: MODES.add,
        meta: mode.meta
      });
      dispatch({
        type: ADDING_FINISH,
        coords
      });
      break;

    case MODES.selectOrMoveMouseDown:
      dispatch({
        type: CHANGE_MODE,
        name: MODES.selectOrMove
      });
      dispatch({
        type: SELECT_HOVERED_COMPONENT,
        coords
      });
      break;

    case MODES.moving:
      dispatch({
        type: CHANGE_MODE,
        name: MODES.selectOrMove
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
      type: CHANGE_MODE_BY_ID,
      meta: {
        id: buttonID
      }
    });
  };
}

export function deleteComponent(id) {
  return function(dispatch) {
    dispatch({
      type: UNSELECT_COMPONENT,
      id
    });
    dispatch({
      type: DELETE_COMPONENT,
      id
    });
  };
}

export function changeComponentValue(id, value) {
  return {
    type: CHANGE_COMPONENT_VALUE,
    id,
    value
  };
}
