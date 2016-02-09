import R from 'ramda';
import Vector from 'immutable-vector2d';

import Components from '../../ui/diagram/components';
import DrawingUtils from '../../ui/utils/DrawingUtils.js';
import { snapToGrid } from '../../ui/diagram/Utils.js';
import { hoverFor } from '../../ui/diagram/boundingBox';

import {
  ADDING_MOVED,
  MOVING_MOVED,
  DELETE_COMPONENT,
  CHANGE_COMPONENT_VALUE,
  SET_HOVERED_COMPONENT
} from '../actions.js';

const { diff } = DrawingUtils;

const moreThanOne = R.pipe(
  R.length,
  R.gt(R.__, 1)
);
const mergeOverWith = R.partial(R.merge, [R.__]);

const isHovered = component => component.hovered;

function moveSingleDragPoint(views, action) {
  const { id, dragPointIndex, origDragPoints } = action.movingComponent; // FIXME REDUCERES

  const view = views[id],
        Component = Components[view.typeID],

        fixedPointIndex = dragPointIndex === 0 ? 1 : 0,
        newDragPoint = Component.dragPoint(action.mouseVector, {fixed: origDragPoints[fixedPointIndex]}),
        dragPoints = R.update(dragPointIndex, newDragPoint, origDragPoints),

        connectors = Component.transform.getConnectors(dragPoints);

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

        connectors = Component.transform.getConnectors(dragPoints);

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

    const connectors = Component.transform.getConnectors(dragPoints);
    const realConnectors = Component.transform.getRealConnectors(dragPoints);

    return {
      ...views,
      [id]: {
        typeID,
        id,
        value: Component.defaultValue,
        dragPoints, // real coordinates of the drag points

        // TODO name these better
        connectors, // coordinates of the connectors in the transformed canvas - used for rendering
        realConnectors
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

  case SET_HOVERED_COMPONENT: {
    const { mousePos } = action;
    const viewsList = R.values(views);

    const getHoverInfo = hoverFor(mousePos);
    const toHoverInfo = view => {
      const { typeID, dragPoints } = view;
      const { hovered, dragPointIndex } = getHoverInfo(typeID, dragPoints);
      return {
        id: view.id,
        hovered,
        dragPointIndex
      };
    };

    const pickBest = R.reduce((currentBest, hoverInfo) => {
      // TODO what if a big component completely covers a smaller one?
      // - we should have a bias for smaller components
      // TODO ugh nested ternaries - not clear what's going on or why
      return currentBest && currentBest.id
        ? currentBest.id === hoverInfo.id
          ? hoverInfo
          : currentBest
        : hoverInfo;
    }, R.find(isHovered, viewsList)); // prefer currently hovered view

    const hoveredComponentInfo = R.pipe(
      R.map(toHoverInfo),
      R.filter(isHovered),
      R.ifElse(moreThanOne,
        pickBest,
        R.head
      )
    )(viewsList);

    const isHoveredComponent = view => hoveredComponentInfo && view.id === hoveredComponentInfo.id;
    const unhover = mergeOverWith({hovered: false, dragPointIndex: null});

    return R.map(
      R.ifElse(isHoveredComponent,
        mergeOverWith(hoveredComponentInfo),
        unhover
      ), views);
  }

  default: return views;
  }
}
