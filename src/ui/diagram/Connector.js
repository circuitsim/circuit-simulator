import React from 'react';
import DrawingUtils from '../utils/DrawingUtils.js';
import Circle from '../utils/Circle.js';
import { CONNECTOR_RADIUS } from './Constants.js';

const { distance, PropTypes } = DrawingUtils;

export default class Connector extends React.Component {

  render() {
    const { hovered, position, theme } = this.props;

    const color = hovered
      ? theme.COLORS.base
      : theme.COLORS.transBase;

    return (
      <Circle
        position={{
          center: position,
          radius: CONNECTOR_RADIUS
        }}
        lineWidth={0}
        fillColor={color}
      />
    );
  }
}

Connector.propTypes = {
  position: PropTypes.Vector.isRequired,
  hovered: React.PropTypes.bool,

  theme: React.PropTypes.object.isRequired
};

Connector.isPointIn = point => connectorPos => {
  return distance(point, connectorPos).length() < CONNECTOR_RADIUS;
};
