import React from 'react';
import {Shape} from 'react-art';

import {drawLine, PropTypes} from './DrawingUtils.js';

export default class Line extends React.Component {

  render() {
    const [end1, end2] = this.props.points,
          linePath = drawLine(end1, end2);
    return (
      <Shape
        strokeWidth={this.props.width}
        stroke={this.props.color}
        strokeJoin='round'
        d={linePath}
      />
    );
  }
}

Line.propTypes = {
  points: React.PropTypes.arrayOf(PropTypes.Vector).isRequired,
  color: React.PropTypes.string.isRequired,
  width: React.PropTypes.number.isRequired
};
