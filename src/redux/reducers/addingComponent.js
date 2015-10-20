import R from 'ramda';
import Vector from 'immutable-vector2d';
import { snapToGrid } from '../../ui/diagram/Utils.js';
import Components from '../../ui/diagram/components';

import {
  ADDING_START,
  ADDING_MOVE,
  ADDING_FINISH
} from '../actions.js';

export default function addingComponentReducer(state, action) {
  switch (action.type) {
  case ADDING_START: {
    const {coords, typeID, id} = action;
    return R.assoc('addingComponent', {
      id,
      typeID,
      start: coords
    }, state);
  }

  case ADDING_MOVE: {
    const {start, id, typeID} = state.addingComponent,

          startPoint = snapToGrid(Vector.fromObject(start)),
          mousePos = Vector.fromObject(action.coords);

    if (snapToGrid(mousePos).equals(startPoint)) {
      return state; // prevent zero size views
    }

    const Component = Components[typeID],
          dragPoint = Component.dragPoint(mousePos, {fixed: startPoint}),
          dragPoints = [startPoint, dragPoint];

    const connectors = Component.getConnectorPositions(dragPoints);

    return R.pipe(
      R.assoc('circuitChanged', true),
      R.assocPath(['views', id], {
        typeID,
        id,
        props: {
          value: Component.defaultValue,
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
