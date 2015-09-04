import Vector from 'immutable-vector2d';
import Utils from '../utils/DrawingUtils.js';

import { GRID_SIZE } from './Constants.js';

export function snapToGrid(v: Vector) {
  return v.snap(GRID_SIZE);
}

export function get2PointConnectorPositionsFor(minLength: number) {
  /**
   * Given a fixed start point, and a second point being dragged,
   * return the connector coordinates for a two-connector element.
   *
   * @param  {Vector} startPoint Fixed starting coordinate
   * @param  {Vector} dragPoint  Coordinate of point being dragged
   */
  return function(startPoint: Vector, dragPoint: Vector) {
    startPoint = startPoint.snap(GRID_SIZE);
    if (dragPoint.snap(GRID_SIZE).equals(startPoint)) {
      return []; // prevent zero size views
    }
    const v = Utils.diff(dragPoint, startPoint).minLength(minLength);
    return [startPoint, startPoint.add(v).snap(GRID_SIZE)];
  };
}
