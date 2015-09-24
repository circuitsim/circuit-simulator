import React from 'react';
import {Shape} from 'react-art';

import {drawCircle, drawCenteredCircle, PropTypes} from './DrawingUtils.js';

const Circle = ({
    position,
    fillColor = 'rgba(0,0,0,0)',
    lineColor = 'rgba(0,0,0,0)',
    lineWidth = 0
  }) => {
  const path = position.points
          ? drawCircle(...position.points)
          : drawCenteredCircle(position.center, position.radius);

  return (
    <Shape
      strokeWidth={lineWidth}
      stroke={lineWidth > 0 ? lineColor : null}
      fill={fillColor}
      d={path}
    />
  );
};

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
  lineWidth: React.PropTypes.number
};

export default Circle;
