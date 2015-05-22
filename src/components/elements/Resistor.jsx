import React from 'react';
import {Group, Shape} from 'react-art';
import Reflux from 'reflux';

import Colors from '../../styles/Colors.js';

import BoundingBox from '../BoundingBox.jsx';

import {drawRectBetweenTwoPoints, drawLine, PropTypes, makeArtListener, midPoint, diff} from '../utils/DrawingUtils.js';
import {LINE_WIDTH, BOUNDING_BOX_PADDING, RESISTOR} from '../utils/Constants.js';

const BOUNDING_BOX_WIDTH = RESISTOR.WIDTH + BOUNDING_BOX_PADDING * 2;

export default React.createClass({

  propTypes: {
    connectors: React.PropTypes.shape({
      from: PropTypes.Vector.isRequired,
      to: PropTypes.Vector.isRequired
    }).isRequired,
    color: React.PropTypes.string,
    mouseOverHandler: React.PropTypes.func,
    mouseOutHandler: React.PropTypes.func
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
    const wireEnd1 = this.props.connectors.from,
          wireEnd2 = this.props.connectors.to,

          n = diff(wireEnd1, wireEnd2).normalize().multiply(RESISTOR.LENGTH / 2),
          mid = midPoint(wireEnd1, wireEnd2),
          compEnd1 = mid.add(n),
          compEnd2 = mid.subtract(n),

          wirePath1 = drawLine(wireEnd1, compEnd1, LINE_WIDTH),
          wirePath2 = drawLine(wireEnd2, compEnd2, LINE_WIDTH),
          rectPath = drawRectBetweenTwoPoints(compEnd1, compEnd2, RESISTOR.WIDTH);

    return (
      <Group>
        <Shape // rectangle
          fill={Colors.transparent}
          stroke={this.state.color}
          strokeWidth={LINE_WIDTH}
          d={rectPath}
        />
        <Shape
          fill={this.state.color}
          d={wirePath1}
        />
        <Shape
          fill={this.state.color}
          d={wirePath2}
        />
        <BoundingBox
          from={wireEnd1}
          to={wireEnd2}
          width={BOUNDING_BOX_WIDTH}
          handlers={{
            mouseOver: makeArtListener(this.highlight),
            mouseOut: makeArtListener(this.unHighlight)
          }}
        />
      </Group>
    );
  }
});
