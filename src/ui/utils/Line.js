import React from 'react';
import {Shape} from 'react-art';

import {drawLine, PropTypes} from './DrawingUtils.js';

const Line = ({
    points,
    color,
    width
  }) => {
  const [end1, end2] = points,
        linePath = drawLine(end1, end2);
  return (
    <Shape
      strokeWidth={width}
      stroke={color}
      strokeJoin='round'
      d={linePath}
    />
  );
};

Line.propTypes = {
  points: React.PropTypes.arrayOf(PropTypes.Vector).isRequired,
  color: React.PropTypes.string.isRequired,
  width: React.PropTypes.number.isRequired
};

export default Line;
