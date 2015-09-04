import R from 'ramda';
import uuid from 'node-uuid';
import Vector from 'immutable-vector2d';
import { handleHover } from 'circuit-diagram';

import MODES from '../../Modes.js';
import {
  ADDING_START,
  ADDING_MOVE,
  ADDING_FINISH
} from '../actions.js';

const getConnectorPositions = function(component, startPoint, dragPoint) {
  return component.getConnectorPositions && component.getConnectorPositions(startPoint, dragPoint);
};

export default function addingComponentsReducer(state, action) {
  switch (action.type) {
  case ADDING_START:
    return R.assoc('mode', {
      type: MODES.adding,
      componentType: state.mode.componentType,
      id: uuid.v4(),
      start: action.coords
    }, state);

  case ADDING_MOVE: {
    const startPoint = Vector.fromObject(state.mode.start),
          dragPoint = Vector.fromObject(action.coords),
          id = state.mode.id,
          type = state.mode.componentType,
          connectors = getConnectorPositions(type, startPoint, dragPoint);
    if (connectors.length === 0) {
      return state; // couldn't get connector positions, maybe too small
    }

    return R.pipe(
      R.assoc('circuitChanged', true),
      R.assocPath(['models', id], type.model),
      R.assocPath(['views', id], {
        component: type,
        props: {
          id,
          connectors
        }
      })
    )(state);
  }

  case ADDING_FINISH: {
    const id = state.mode.id,
          componentType = state.mode.componentType,
          stateWithNextMode = R.assoc('mode', {
            type: MODES.add,
            componentType
          }, state),
          newView = state.views[id];

    if (newView) {
      return R.pipe(
        R.assoc('circuitChanged', true),
        R.assocPath(['views', id, 'component'], handleHover(newView.component))
      )(stateWithNextMode);
    } else {
      return stateWithNextMode;
    }
  }

  default:
    return state;
  }
}
