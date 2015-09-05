import React from 'react';
import {Shape} from 'react-art';

import {drawCircle, PropTypes} from './DrawingUtils.js';

export default class Circle extends React.Component {

  render() {
    const {points: [end1, end2], fillColor, lineColor, lineWidth} = this.props,
          linePath = drawCircle(end1, end2);
    return (
      <Shape
        strokeWidth={lineWidth}
        stroke={lineColor}
        fill={fillColor}
        d={linePath}
      />
    );
  }
}

Circle.propTypes = {
  points: React.PropTypes.arrayOf(PropTypes.Vector).isRequired,
  fillColor: React.PropTypes.string,
  lineColor: React.PropTypes.string.isRequired,
  lineWidth: React.PropTypes.number.isRequired
};

Circle.defaultProps = {
  fillColor: 'rgba(0,0,0,0)'
};
