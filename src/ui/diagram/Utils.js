import Vector from 'immutable-vector2d';
import Utils from '../utils/DrawingUtils.js';
import { GRID_SIZE } from './Constants.js';

const { diff } = Utils;

export function snapToGrid(v: Vector) {
  return v.snap(GRID_SIZE);
}

const roundUpToNearestMultipleOf = mult => n => {
  return mult * Math.ceil(n / mult);
};
const roundUpToGrid = roundUpToNearestMultipleOf(GRID_SIZE);

export function getDragFunctionFor(minLength: number) {
  minLength = roundUpToGrid(minLength);
  /**
   * Ensure that the point being dragged is properly snapped,
   * and a minimum distance away from a fixed point.
   */
  return (dragPoint, { fixed }) => {
    const fixedPoint = snapToGrid(fixed);
    const dragOffset = diff(dragPoint, fixedPoint).minLength(minLength);
    return snapToGrid(fixedPoint.add(dragOffset));
  };
}

export function get2ConnectorsFromDragPoints(dragPoints) {
  return dragPoints;
}

export function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}
