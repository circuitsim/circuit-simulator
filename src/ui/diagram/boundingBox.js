import R from 'ramda';
import inside from 'point-in-polygon';
import Vector from 'immutable-vector2d';

import CircuitComponents from './components';
import DragPoint from './DragPoint.js';
import { BOUNDING_BOX_PADDING, DRAG_POINT_RADIUS } from './Constants.js';
import { getRectPointsBetween } from '../utils/DrawingUtils.js';

const MIN_WIDTH = DRAG_POINT_RADIUS * 2;
const sanitise = width => {
  width = width > MIN_WIDTH
    ? width
    : MIN_WIDTH;
  return width + 2 * BOUNDING_BOX_PADDING;
};

// Bounding box stuff

/*
 * A bounding box is represented e.g. [[1, 2], [3, 4], [5, 6]]
 */

export const get2PointBoundingBox = width => connectors => {
  const [p1, p2] = connectors;
  const fullWidth = sanitise(width);
  const rectanglePoints = getRectPointsBetween(p1, p2, fullWidth);
  return R.map(p => [p.x, p.y], rectanglePoints);
};

function isPointIn(p: Vector, polygon) {
  const point = [p.x, p.y];
  return inside(point, polygon);
}

export const hoverFor = (mousePos: Vector) => (typeID, dragPoints) => {
  const CircuitComp = CircuitComponents[typeID];

  const hoveredDragPointIndex = R.findIndex(DragPoint.isPointIn(mousePos), dragPoints);
  const isIndex = R.is(Number, hoveredDragPointIndex) && hoveredDragPointIndex >= 0;
  return {
    hovered: isPointIn(mousePos, CircuitComp.getBoundingBox(dragPoints)) || isIndex,
    dragPointIndex: isIndex ? hoveredDragPointIndex : false
  };
};
