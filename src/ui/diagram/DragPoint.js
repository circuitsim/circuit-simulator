import React from 'react';
import DrawingUtils from '../utils/DrawingUtils.js';
import Circle from '../utils/Circle.js';
import { DRAG_POINT_RADIUS } from './Constants.js';

const { distance, PropTypes } = DrawingUtils;

const DragPoint = ({ hovered, position, theme }) => {
  return (
    <Circle
      position={{
        center: position,
        radius: DRAG_POINT_RADIUS
      }}
      lineWidth={hovered ? 2 : 0}
      lineColor={theme.COLORS.base}
      fillColor={theme.COLORS.transBase}
    />
  );
};

DragPoint.propTypes = {
  position: PropTypes.Vector.isRequired,
  hovered: React.PropTypes.bool,

  theme: React.PropTypes.object.isRequired
};

DragPoint.isPointIn = point => connectorPos => {
  return distance(point, connectorPos).length() < DRAG_POINT_RADIUS;
};

export default DragPoint;
