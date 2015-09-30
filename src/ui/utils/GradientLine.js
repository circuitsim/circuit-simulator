import React from 'react';
import {Shape, LinearGradient} from 'react-art';

import {getRectPathBetween, PropTypes} from './DrawingUtils.js';

const GradientLine = ({
    points,
    colors,
    width
  }) => {
  const [end1, end2] = points,
        rectPath = getRectPathBetween(end1, end2, width);
  return (
    <Shape
      strokeWidth={0}
      stroke={null}
      fill={new LinearGradient(colors, end1.x, end1.y, end2.x, end2.y)}
      d={rectPath}
    />
  );
};

GradientLine.propTypes = {
  points: React.PropTypes.arrayOf(PropTypes.Vector).isRequired,
  colors: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  width: React.PropTypes.number.isRequired
};

export default GradientLine;
