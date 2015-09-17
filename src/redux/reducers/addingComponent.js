import R from 'ramda';
import uuid from 'node-uuid';
import Vector from 'immutable-vector2d';
import Components from '../../ui/diagram/components/AllViews.js';

import {
  ADDING_START,
  ADDING_MOVE,
  ADDING_FINISH
} from '../actions.js';

export default function addingComponentReducer(state, action) {
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
          component = Components[typeID],
          dragPoints = component.getDragPointPositions([startPoint, dragPoint]);
    if (dragPoints.length === 0) {
      return state; // couldn't get dragPoint positions, maybe too small
    }

    const connectors = component.getConnectorPositions(dragPoints);

    return R.pipe(
      R.assoc('circuitChanged', true),
      R.assocPath(['views', id], {
        typeID,
        props: {
          id,
          dragPoints,
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
