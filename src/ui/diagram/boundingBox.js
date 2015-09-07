import R from 'ramda';
import getBoundingBox from 'getboundingbox';

import DrawingUtils from '../utils/DrawingUtils.js';

// Bounding box stuff

// Currently this just uses a non-rotated (i.e. horizontal) rectangles defined by
// max/min X/Y points.
// This is simple and efficient, but has the disadvantage of large empty spaces
// for e.g. diagonal wires.
// A nicer solution would use rotated rectangles for e.g. diagonal wires.

export default width => connectors => {
  const [p1, p2] = connectors;
  const points = R.map(p => [p.x, p.y],
    DrawingUtils.getRectPointsBetween(p1, p2, width));

  return getBoundingBox(points);
};

export function isPointIn(point, boundingBox) {
  const { x, y } = point;
  const { maxX, minX, maxY, minY } = boundingBox;
  return x < maxX
    && x > minX
    && y < maxY
    && y > minY;
}
