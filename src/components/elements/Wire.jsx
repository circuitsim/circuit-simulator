import React from 'react';

import Colors from '../../styles/Colors.js';

import {Shape, Group} from 'react-art';

import {drawRectBetweenTwoPoints, drawLine, PropTypes, makeArtListener} from '../utils/DrawingUtils.js';
import {LINE_WIDTH, BOUNDING_BOX_PADDING} from '../utils/Constants.js';

const BOUNDING_BOX_WIDTH = LINE_WIDTH + BOUNDING_BOX_PADDING * 2;

export default class Wire extends React.Component {

  constructor(props) {
    super(props);
    this.state = {color: Colors.base};
    this.highlight = this.highlight.bind(this);
    this.unHighlight = this.unHighlight.bind(this);
  }

  highlight() {
    this.setState({color: Colors.theme});
  }

  unHighlight() {
    this.setState({color: Colors.base});
  }

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
}

Wire.propTypes = {
  connectors: React.PropTypes.shape({
    from: PropTypes.Vector.isRequired,
    to: PropTypes.Vector.isRequired
  }).isRequired
};
