import React from 'react';
import {Shape} from 'react-art';

import {drawCircle, drawCenteredCircle, PropTypes} from './DrawingUtils.js';

export default class Circle extends React.Component {

  render() {
    const {position, fillColor, lineColor, lineWidth} = this.props,
          path = position.points
            ? drawCircle(...position.points)
            : drawCenteredCircle(position.center, position.radius);

    return (
      <Shape
        strokeWidth={lineWidth}
        stroke={lineColor}
        fill={fillColor}
        d={path}
      />
    );
  }
}

Circle.propTypes = {
  position: React.PropTypes.oneOfType([
    React.PropTypes.shape({
      center: PropTypes.Vector,
      radius: PropTypes.number
    }),
    React.PropTypes.shape({
      points: React.PropTypes.arrayOf(PropTypes.Vector) // two points
    })
  ]).isRequired,
  fillColor: React.PropTypes.string,
  lineColor: React.PropTypes.string,
  lineWidth: React.PropTypes.number.isRequired
};

Circle.defaultProps = {
  fillColor: 'rgba(0,0,0,0)',
  lineColor: 'rgba(0,0,0,0)'
};
