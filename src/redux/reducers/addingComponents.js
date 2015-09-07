import R from 'ramda';
import uuid from 'node-uuid';
import Vector from 'immutable-vector2d';
import Components from '../../ui/diagram/components/AllViews.js';

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
    const {coords, typeID} = action;
    return R.assoc('addingComponent', {
      id: uuid.v4(),
      start: coords,
      typeID
    }, state);
  }

  case ADDING_MOVE: {
    const {start, id, typeID} = state.addingComponent,
          startPoint = Vector.fromObject(start),
          dragPoint = Vector.fromObject(action.coords),
          connectors = getConnectorPositions(Components[typeID], startPoint, dragPoint);
    if (connectors.length === 0) {
      return state; // couldn't get connector positions, maybe too small
    }

    return R.pipe(
      R.assoc('circuitChanged', true),
      R.assocPath(['views', id], {
        typeID,
        props: {
          id,
          connectors
        }
      })
    )(state);
  }

  case ADDING_FINISH: {
    return R.assoc('addingComponent', {}, state);
  }

  default:
    return state;
  }
}
