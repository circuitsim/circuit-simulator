import R from 'ramda';
import Vector from 'immutable-vector2d';

import Components from '../../ui/diagram/components';
import DrawingUtils from '../../ui/utils/DrawingUtils.js';
import { snapToGrid } from '../../ui/diagram/Utils.js';

import {
  ADDING_MOVED,
  MOVING_MOVED,
  DELETE_COMPONENT,
  CHANGE_COMPONENT_VALUE
} from '../actions.js';

const { diff } = DrawingUtils;

function moveSingleDragPoint(views, action) {
  const { id, dragPointIndex, origDragPoints } = action.movingComponent; // FIXME REDUCERES

  const view = views[id],
        Component = Components[view.typeID],

        fixedPointIndex = dragPointIndex === 0 ? 1 : 0,
        newDragPoint = Component.dragPoint(action.mouseVector, {fixed: origDragPoints[fixedPointIndex]}),
        dragPoints = R.update(dragPointIndex, newDragPoint, origDragPoints),

        connectors = Component.getConnectorPositions(dragPoints);

  return {
    ...views,
    [id]: {
      ...view,
      dragPoints,
      connectors
    }
  };
}

function moveWholeComponent(views, action) {
  const { id, from, origDragPoints } = action.movingComponent;

  const view = views[id],
        Component = Components[view.typeID],

        diffVector = diff(from, action.mouseVector),
        dragPoints = R.map(v => snapToGrid(v.subtract(diffVector)), origDragPoints),

        connectors = Component.getConnectorPositions(dragPoints);

  return {
    ...views,
    [id]: {
      ...view,
      dragPoints,
      connectors
    }
  };
}

export default function viewsReducer(views = {}, action) {
  switch (action.type) {
  case ADDING_MOVED: {
    const {start, id, typeID} = action.addingComponent,

          startPoint = snapToGrid(Vector.fromObject(start)),
          mousePos = Vector.fromObject(action.coords);

    if (snapToGrid(mousePos).equals(startPoint)) {
      return views; // prevent zero size views
    }

    const Component = Components[typeID],
          dragPoint = Component.dragPoint(mousePos, {fixed: startPoint}),
          dragPoints = [startPoint, dragPoint];

    const connectors = Component.getConnectorPositions(dragPoints);

    return {
      ...views,
      [id]: {
        typeID,
        id,
        value: Component.defaultValue,
        dragPoints,
        connectors
      }
    };
  }

  case MOVING_MOVED: {
    const { hoveredComponent } = action,
          { dragPointIndex } = hoveredComponent;
    if (R.is(Number, dragPointIndex) && dragPointIndex >= 0) {
      return moveSingleDragPoint(views, action);
    } else {
      return moveWholeComponent(views, action);
    }
  }

  case DELETE_COMPONENT: {
    return R.dissoc(action.id, views);
  }

  case CHANGE_COMPONENT_VALUE: {
    return {
      ...views,
      [action.id]: {
        ...views[action.id],
        value: action.value
      }
    };
  }
  default:
    return views;
  }
}
