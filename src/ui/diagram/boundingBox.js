import R from 'ramda';
import inside from 'point-in-polygon';
import Vector from 'immutable-vector2d';

import CircuitComponents from './components/AllViews.js';
import Connector from './Connector.js';
import { BOUNDING_BOX_PADDING } from './Constants.js';
import { getRectPointsBetween } from '../utils/DrawingUtils.js';

// Bounding box stuff

/*
 * A bounding box is represented e.g. [[1, 2], [3, 4], [5, 6]]
 */

export const get2PointBoundingBox = width => connectors => {
  const [p1, p2] = connectors;
  const rectanglePoints = getRectPointsBetween(p1, p2, width + 2 * BOUNDING_BOX_PADDING);
  return R.map(p => [p.x, p.y], rectanglePoints);
};

function isPointIn(p: Vector, polygon) {
  const point = [p.x, p.y];
  return inside(point, polygon);
}

export const hoverFor = (mousePos: Vector) => (typeID, connectors) => {
  const CircuitComp = CircuitComponents[typeID];

  const hoveredConnectorIndex = R.findIndex(Connector.isPointIn(mousePos), connectors);
  return {
    hovered: isPointIn(mousePos, CircuitComp.getBoundingBox(connectors)) || hoveredConnectorIndex !== -1,
    connectorIndex: hoveredConnectorIndex
  };
};
