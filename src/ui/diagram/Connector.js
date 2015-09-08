import React from 'react';
import DrawingUtils from '../utils/DrawingUtils.js';
import Circle from '../utils/Circle.js';
import { GRID_SIZE } from './Constants.js';

const { distance, PropTypes } = DrawingUtils;

const RADIUS = Math.floor(GRID_SIZE / 3);

export default class Connector extends React.Component {

  render() {
    const { position, color } = this.props;

    return (
      <Circle
        position={{
          center: position,
          radius: RADIUS
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
  return distance(mousePos, connectorPos) < RADIUS;
};
