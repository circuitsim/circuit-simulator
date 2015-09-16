import R from 'ramda';
import inside from 'point-in-polygon';

import { getRectPointsBetween } from '../utils/DrawingUtils.js';

// Bounding box stuff

/*
 * A bounding box is represented e.g. [[1, 2], [3, 4], [5, 6]]
 */

export const get2PointBoundingBox = width => connectors => {
  const [p1, p2] = connectors;
  const rectanglePoints = getRectPointsBetween(p1, p2, width);
  return R.map(p => [p.x, p.y], rectanglePoints);
};

export function isPointIn(pointVector, polygon) {
  const point = [pointVector.x, pointVector.y];
  return inside(point, polygon);
}
