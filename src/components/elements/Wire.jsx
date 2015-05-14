import React from 'react';
import Reflux from 'reflux';

import Colors from '../../styles/Colors.js';

import {Shape, Group} from 'react-art';

import {drawRectBetweenTwoPoints, PropTypes} from '../utils/DrawingUtils.js';

const WIDTH = 2;
const BOX_WIDTH = 10;

export default React.createClass({

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
    const boundingBoxPath = drawRectBetweenTwoPoints(this.props.from, this.props.to, BOX_WIDTH);
    return (
      <Group>
        <Shape
          fill={this.state.color}
          d={wirePath}
        />
        <Shape // bounding box goes on top, bottom of the list
          onMouseOver={this.highlight}
          onMouseOut={this.unHighlight}
          fill={Colors.transparent}
          d={boundingBoxPath}
        />
      </Group>
    );
  }
});
