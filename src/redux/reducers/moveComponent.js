import R from 'ramda';

import Components from '../../ui/diagram/components';
import DrawingUtils from '../../ui/utils/DrawingUtils.js';
import { snapToGrid } from '../../ui/diagram/Utils.js';
import {
  MOVING_START,
  MOVING_MOVE,
  MOVING_FINISH
} from '../actions.js';

const { diff } = DrawingUtils;

function moveSingleDragPoint(state, action) {
  const { movingComponent: { id, dragPointIndex, origDragPoints }, views } = state;

  const view = views[id],
        Component = Components[view.typeID],

        fixedPointIndex = dragPointIndex === 0 ? 1 : 0,
        newDragPoint = Component.dragPoint(action.mouseVector, {fixed: origDragPoints[fixedPointIndex]}),
        dragPoints = R.update(dragPointIndex, newDragPoint, origDragPoints),

        connectors = Component.getConnectorPositions(dragPoints);

  return R.pipe(
    R.assoc('circuitChanged', true),
    R.assocPath(['views', id], {
      typeID: view.typeID,
      props: {
        id,
        dragPoints,
        connectors
      }
    })
  )(state);
}

function moveWholeComponent(state, action) {
  const { movingComponent: { id, from, origDragPoints }, views } = state;

  const view = views[id],
        component = Components[view.typeID],

        diffVector = diff(from, action.mouseVector),
        dragPoints = R.map(v => snapToGrid(v.subtract(diffVector)), origDragPoints),

        connectors = component.getConnectorPositions(dragPoints);

  return R.pipe(
    R.assoc('circuitChanged', true),
    R.assocPath(['views', id], {
      typeID: view.typeID,
      props: {
        id,
        dragPoints,
        connectors
      }
    })
  )(state);
}

export default function addingComponentReducer(state, action) {
  switch (action.type) {
  case MOVING_START: {
    const { hover: { viewID, dragPointIndex }, views } = state;
    return R.assoc('movingComponent', {
      id: viewID,
      from: action.mouseVector,
      origDragPoints: views[viewID].props.dragPoints,
      dragPointIndex
    }, state);
  }

  case MOVING_MOVE: {
    const { hover: { dragPointIndex } } = state;
    if (R.is(Number, dragPointIndex) && dragPointIndex >= 0) {
      return moveSingleDragPoint(state, action);
    } else {
      return moveWholeComponent(state, action);
    }
  }

  case MOVING_FINISH: {
    return R.assoc('movingComponent', {}, state);
  }

  default:
    return state;
  }
}
