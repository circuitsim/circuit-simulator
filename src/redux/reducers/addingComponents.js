import R from 'ramda';
import uuid from 'node-uuid';
import Vector from 'immutable-vector2d';
import handleHover from '../../ui/diagram/handleHover.js';

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
  case ADDING_START: {
    const {coords, componentType} = action;
    return R.assoc('addingComponent', {
      id: uuid.v4(),
      start: coords,
      componentType
    }, state);
  }

  case ADDING_MOVE: {
    const {start, id, componentType: type} = state.addingComponent,
          startPoint = Vector.fromObject(start),
          dragPoint = Vector.fromObject(action.coords),
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
    const { id } = state.addingComponent,
          newView = state.views[id];

    if (newView) {
      return R.pipe(
        R.assoc('addingComponent', {}),
        R.assoc('circuitChanged', true),
        R.assocPath(['views', id, 'component'], handleHover(newView.component))
      )(state);
    }
    return state;
  }

  default:
    return state;
  }
}
