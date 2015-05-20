import React from 'react';
import Reflux from 'reflux';

import Colors from '../../styles/Colors.js';

import {Shape, Group} from 'react-art';

import {drawRectBetweenTwoPoints, PropTypes, makeArtListener} from '../utils/DrawingUtils.js';
import Constants from '../utils/Constants.js';

const BOUNDING_BOX_WIDTH = Constants.LINE_WIDTH + Constants.BOUNDING_BOX_PADDING * 2;

export default React.createClass({

  propTypes: {
    from: PropTypes.Vector.isRequired,
    to: PropTypes.Vector.isRequired
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
    const wirePath = drawRectBetweenTwoPoints(this.props.from, this.props.to, Constants.LINE_WIDTH);
    const boundingBoxPath = drawRectBetweenTwoPoints(this.props.from, this.props.to, BOUNDING_BOX_WIDTH);
    return (
      <Group>
        <Shape
          fill={this.state.color}
          d={wirePath}
        />
        <Shape // bounding box goes on top, bottom of the list
          onMouseOver={makeArtListener(this.highlight)}
          onMouseOut={makeArtListener(this.unHighlight)}
          fill={Colors.transparent}
          d={boundingBoxPath}
        />
      </Group>
    );
  }
});
