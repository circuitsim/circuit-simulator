import React from 'react';
import Reflux from 'reflux';

import Colors from '../../styles/Colors.js';

import {Shape} from 'react-art';

import {drawRectBetweenTwoPoints, PropTypes} from '../utils/DrawingUtils.js';

const WIDTH = 2;

module.exports = React.createClass({

  propTypes: {
    from: PropTypes.Coordinate.isRequired,
    to: PropTypes.Coordinate.isRequired
  },

  mixins: [Reflux.ListenerMixin],

  getInitialState() {
    return {color: Colors.base};
  },

  highlight() {
    this.setState({color: Colors.theme});
  },

  unHighlight() {
    this.setState({color: Colors.base});
  },

  render() {
    const wirePath = drawRectBetweenTwoPoints(this.props.from, this.props.to, WIDTH);

    return (
      <Shape
        onMouseOver={this.highlight}
        onMouseOut={this.unHighlight}
        fill={this.state.color}
        d={wirePath}
      />
    );
  }
});
