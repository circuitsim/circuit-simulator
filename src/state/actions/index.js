import R from 'ramda';
import Vector from 'immutable-vector2d';
import uuid from 'node-uuid';

import MODES from '../../Modes';

import { TIMESTEP } from '../../ui/diagram/loop';

// Action types
export const CHANGE_MODE = 'CHANGE_MODE';

export const SET_HOVERED_COMPONENT = 'SET_HOVERED_COMPONENT';
export const SELECT_HOVERED_COMPONENT = 'SELECT_HOVERED_COMPONENT';
export const UNSELECT_COMPONENT = 'UNSELECT_COMPONENT';

export const ADDING_START = 'ADDING_START';
export const ADDING_MOVED = 'ADDING_MOVED';
export const ADDING_FINISH = 'ADDING_FINISH';

export const MOVING_START = 'MOVING_START';
export const MOVING_MOVED = 'MOVING_MOVED';
export const MOVING_FINISH = 'MOVING_FINISH';

export const MOUSE_MOVED = 'MOUSE_MOVED';

export const SHOW_ADD_TOASTER = 'SHOW_ADD_TOASTER';
export const HIDE_ADD_TOASTER = 'HIDE_ADD_TOASTER';

// Action creators
export function canvasMouseEnter() {
  return function(dispatch, getState) {
    const { mode, views } = getState();

    if (mode.type === MODES.add && R.isEmpty(views)) {
      dispatch({
        type: SHOW_ADD_TOASTER
      });
    }
  };
}

export function canvasMouseLeave() {
  return {
    type: HIDE_ADD_TOASTER
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

    const {
      mode,
      views,
      addingComponent,
      movingComponent
    } = getState();

    const hoveredComponent = R.find(c => c.hovered, R.values(views));

    switch (mode.type) {
    case MODES.adding:
      dispatch({
        type: ADDING_MOVED,
        coords,
        addingComponent
      });
      break;

    case MODES.selectOrMoveMouseDown:
      if (hoveredComponent) {
        dispatch({
          type: CHANGE_MODE,
          name: MODES.moving
        });
        dispatch({
          type: MOVING_START,
          mouseVector: Vector.fromObject(coords),
          component: hoveredComponent
        });
      }
      break;

    case MODES.moving:
      dispatch({
        type: MOVING_MOVED,
        mouseVector: Vector.fromObject(coords),
        hoveredComponent,
        movingComponent
      });
      break;
    }
  };
}

export function canvasMouseUp(coords) {
  return function(dispatch, getState) {
    const {
      mode,
      views
    } = getState();
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
      dispatch({
        type: HIDE_ADD_TOASTER
      });
      break;

    case MODES.selectOrMoveMouseDown:
      dispatch({
        type: CHANGE_MODE,
        name: MODES.selectOrMove
      });
      dispatch({
        type: SELECT_HOVERED_COMPONENT,
        coords,
        views
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

export const LOOP_BEGIN = 'LOOP_BEGIN';
export function loopBegin() {
  return function(dispatch, getState) {
    const { views, mousePos, mode } = getState();
    if (mode.type === MODES.selectOrMove) { // only hover highlight in move mode
      dispatch({
        type: SET_HOVERED_COMPONENT,
        views,
        mousePos,
        mode
      });
    }
    dispatch({
      type: LOOP_BEGIN,
      views,
      mode
    });
  };
}

export const LOOP_UPDATE = 'LOOP_UPDATE';
export function loopUpdate(delta) {
  return {
    type: LOOP_UPDATE,
    delta
  };
}

export const KEY_PRESS = 'KEY_PRESS';
export function keyPress(key) {
  return {
    type: KEY_PRESS,
    key
  };
}

export const CHANGE_MODE_BY_ID = 'CHANGE_MODE_BY_ID';
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

export const DELETE_COMPONENT = 'DELETE_COMPONENT';
export function deleteComponent(id) {
  return function(dispatch, getState) {
    const { selected } = getState();
    dispatch({
      type: UNSELECT_COMPONENT,
      id,
      selected
    });
    dispatch({
      type: DELETE_COMPONENT,
      id
    });
  };
}

export const EDIT_COMPONENT = 'EDIT_COMPONENT';
export const CHANGE_COMPONENT_FREQ = 'CHANGE_COMPONENT_FREQ';
export function editComponent(id, editable, value) {
  return function(dispatch, getState) {
    if (editable === 'frequency') { // special casing this for now - hopefully there's a better way
      const {circuit: {simTime}} = getState();
      dispatch({
        type: CHANGE_COMPONENT_FREQ,
        id,
        simTime
      });
    }
    dispatch({
      type: EDIT_COMPONENT,
      id,
      editable,
      value
    });
  };
}

export const CHANGE_CURRENT_SPEED = 'CHANGE_CURRENT_SPEED';
export function changeCurrentSpeed(speed) {
  return {
    type: CHANGE_CURRENT_SPEED,
    speed
  };
}

export const UPDATE_CURRENT_OFFSETS = 'UPDATE_CURRENT_OFFSETS';
export function updateCurrentOffsets(delta) {
  return function(dispatch, getState) {
    const { currentSpeed, circuit } = getState();
    dispatch({
      type: UPDATE_CURRENT_OFFSETS,
      delta,
      currentSpeed,
      componentStates: circuit.components
    });
  };
}

export const RATIONALISE_CURRENT_OFFSETS = 'RATIONALISE_CURRENT_OFFSETS';
export function rationaliseCurrentOffsets() {
  return function(dispatch, getState) {
    const { circuit } = getState();
    dispatch({
      type: RATIONALISE_CURRENT_OFFSETS,
      componentStates: circuit.components
    });
  };
}

export const LOAD_CIRCUIT = 'LOAD_CIRCUIT';
export function loadCircuit(circuit) {
  return function(dispatch) {
    dispatch({
      type: LOAD_CIRCUIT,
      circuit
    });
    dispatch(loopBegin());
    dispatch(loopUpdate(TIMESTEP));
  };
}

export const PRINT_CIRCUIT = 'PRINT_CIRCUIT';
export function printCircuit() {
  return {
    type: PRINT_CIRCUIT
  };
}
