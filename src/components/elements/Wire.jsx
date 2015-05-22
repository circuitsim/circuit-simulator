import React from 'react';
import Reflux from 'reflux';

import Colors from '../../styles/Colors.js';

import {Shape, Group} from 'react-art';

import {drawRectBetweenTwoPoints, drawLine, PropTypes, makeArtListener} from '../utils/DrawingUtils.js';
import {LINE_WIDTH, BOUNDING_BOX_PADDING} from '../utils/Constants.js';

const BOUNDING_BOX_WIDTH = LINE_WIDTH + BOUNDING_BOX_PADDING * 2;

export default React.createClass({

  propTypes: {
    connectors: React.PropTypes.shape({
      from: PropTypes.Vector.isRequired,
      to: PropTypes.Vector.isRequired
    }).isRequired
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
    const end1 = this.props.connectors.from, end2 = this.props.connectors.to;
    const wirePath = drawLine(end1, end2);
    const boundingBoxPath = drawRectBetweenTwoPoints(end1, end2, BOUNDING_BOX_WIDTH);
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
