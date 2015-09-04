import MODES from '../Modes.js';

// Action types
export const ADDING_START = 'ADDING_START';
export const ADDING_MOVE = 'ADDING_MOVE';
export const ADDING_FINISH = 'ADDING_FINISH';

export const COMPONENT_MOUSE_OVER = 'COMPONENT_MOUSE_OVER';
export const COMPONENT_MOUSE_OUT = 'COMPONENT_MOUSE_OUT';

export const LOOP_BEGIN = 'LOOP_BEGIN';
export const LOOP_UPDATE = 'LOOP_UPDATE';

export const KEY_PRESS = 'KEY_PRESS';

export const COMPONENT_SELECTOR_BUTTON_CLICKED = 'COMPONENT_SELECTOR_BUTTON_CLICKED';

// Action creators
export function canvasMouseDown(coords) {
  return function(dispatch, getState) {
    if (getState().mode.type === MODES.add) {
      dispatch({
        type: ADDING_START,
        coords
      });
    }
  };
}

export function canvasMouseMove(coords) {
  return function(dispatch, getState) {
    if (getState().mode.type === MODES.adding) {
      dispatch({
        type: ADDING_MOVE,
        coords
      });
    }
  };
}

export function canvasMouseUp(coords) {
  return function(dispatch, getState) {
    if (getState().mode.type === MODES.adding) {
      dispatch({
        type: ADDING_FINISH,
        coords
      });
    }
  };
}

export function componentMouseOver(id) {
  return {
    type: COMPONENT_MOUSE_OVER,
    id
  };
}

export function componentMouseOut(id) {
  return {
    type: COMPONENT_MOUSE_OUT,
    id
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
  return {
    type: COMPONENT_SELECTOR_BUTTON_CLICKED,
    buttonID
  };
}
