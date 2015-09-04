
// Action types
export const CANVAS_MOUSE_DOWN = 'CANVAS_MOUSE_DOWN';
export const CANVAS_MOUSE_MOVE = 'CANVAS_MOUSE_MOVE';
export const CANVAS_MOUSE_UP = 'CANVAS_MOUSE_UP';

export const START_ADDING = 'START_ADDING';

export const COMPONENT_MOUSE_OVER = 'COMPONENT_MOUSE_OVER';
export const COMPONENT_MOUSE_OUT = 'COMPONENT_MOUSE_OUT';

export const LOOP_BEGIN = 'LOOP_BEGIN';
export const LOOP_UPDATE = 'LOOP_UPDATE';

export const KEY_PRESS = 'KEY_PRESS';

export const COMPONENT_SELECTOR_BUTTON_CLICKED = 'COMPONENT_SELECTOR_BUTTON_CLICKED';

// Action creators
export function canvasMouseDown(coords) {
  return {
    type: CANVAS_MOUSE_DOWN,
    coords
  };
}

export function canvasMouseMove(coords) {
  return {
    type: CANVAS_MOUSE_MOVE,
    coords
  };
}

export function canvasMouseUp(coords) {
  return {
    type: CANVAS_MOUSE_UP,
    coords
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
