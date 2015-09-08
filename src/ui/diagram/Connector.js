import React from 'react';
import DrawingUtils from '../utils/DrawingUtils.js';
import Circle from '../utils/Circle.js';
import { CONNECTOR_RADIUS } from './Constants.js';

const { distance, PropTypes } = DrawingUtils;

export default class Connector extends React.Component {

  render() {
    const { position, color } = this.props;

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
  color: React.PropTypes.string.isRequired
};

Connector.isMouseOver = (mousePos, connectorPos) => {
  return distance(mousePos, connectorPos) < CONNECTOR_RADIUS;
};
