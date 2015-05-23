import React from 'react';
import {Shape} from 'react-art';

import Colors from '../../styles/Colors.js';

import BoundingBox from '../BoundingBox.jsx';

import {drawLine, drawCircle, PropTypes, makeArtListener, midPoint, diff} from '../utils/DrawingUtils.js';
import {LINE_WIDTH, BOUNDING_BOX_PADDING, CURRENT_SOURCE} from '../utils/Constants.js';

const BOUNDING_BOX_WIDTH = CURRENT_SOURCE.RADIUS * 2 + BOUNDING_BOX_PADDING * 2;

export default class CurrentSource extends React.Component {

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
    const wireEnd1 = this.props.connectors.from,
          wireEnd2 = this.props.connectors.to,

          mid = midPoint(wireEnd1, wireEnd2),
          n = diff(wireEnd1, wireEnd2).normalize(),

          compOffset = n.multiply(CURRENT_SOURCE.RADIUS * 1.5),
          circleOffset = n.multiply(CURRENT_SOURCE.RADIUS / 2),

          compEnd1 = mid.add(compOffset),
          compEnd2 = mid.subtract(compOffset),

          wirePath1 = drawLine(wireEnd1, compEnd1, LINE_WIDTH),
          wirePath2 = drawLine(wireEnd2, compEnd2, LINE_WIDTH),

          circlePath1 = drawCircle(compEnd1, mid.subtract(circleOffset)),
          circlePath2 = drawCircle(mid.add(circleOffset), compEnd2);

    return (
      <BoundingBox
        from={wireEnd1}
        to={wireEnd2}
        width={BOUNDING_BOX_WIDTH}
        handlers={{
          mouseOver: makeArtListener(this.highlight),
          mouseOut: makeArtListener(this.unHighlight)
        }}
      >
        <Shape
          fill={Colors.transparent}
          stroke={this.state.color}
          strokeWidth={LINE_WIDTH}
          d={circlePath1}
        />
        <Shape
          fill={Colors.transparent}
          stroke={this.state.color}
          strokeWidth={LINE_WIDTH}
          d={circlePath2}
        />
        <Shape
          fill={this.state.color}
          d={wirePath1}
        />
        <Shape
          fill={this.state.color}
          d={wirePath2}
        />
      </BoundingBox>
    );
  }
}

CurrentSource.propType = {
  connectors: React.PropTypes.shape({
    from: PropTypes.Vector.isRequired,
    to: PropTypes.Vector.isRequired
  }).isRequired
};
