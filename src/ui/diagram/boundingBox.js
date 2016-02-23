import R from 'ramda';
import inside from 'point-in-polygon';
import Vector from 'immutable-vector2d';

import CircuitComponents from './components';
import { BOUNDING_BOX_PADDING, DRAG_POINT_RADIUS } from './Constants.js';
import { getRectPointsBetween, distance } from '../utils/DrawingUtils.js';

const MIN_WIDTH = DRAG_POINT_RADIUS * 2;
const sanitise = width => {
  width = width > MIN_WIDTH
    ? width
    : MIN_WIDTH;
  return width + 2 * BOUNDING_BOX_PADDING;
};

// Bounding box stuff

/*
 * A bounding box is represented e.g. [[1, 2], [3, 4], [5, 6], [7, 8]]
 */

export const get2PointBoundingBox = width => dragPoints => {
  const [p1, p2] = dragPoints;
  const fullWidth = sanitise(width);
  const rectanglePoints = getRectPointsBetween(p1, p2, fullWidth);
  return R.map(p => [p.x, p.y], rectanglePoints);
};

function isPointIn(p: Vector, polygon: Array<[number, number]>) {
  const point = [p.x, p.y];
  return inside(point, polygon);
}

const isPointInDragPoint = point => connectorPos => {
  return distance(point, connectorPos).length() < DRAG_POINT_RADIUS;
};

export const hoverFor = (mousePos: Vector) => (typeID, dragPoints) => {
  const CircuitComp = CircuitComponents[typeID];

  const hoveredDragPointIndex = R.findIndex(isPointInDragPoint(mousePos), dragPoints);
  const isIndex = R.is(Number, hoveredDragPointIndex) && hoveredDragPointIndex >= 0;
  return {
    hovered: isPointIn(mousePos, CircuitComp.getBoundingBox(dragPoints)) || isIndex,
    dragPointIndex: isIndex ? hoveredDragPointIndex : false
  };
};
