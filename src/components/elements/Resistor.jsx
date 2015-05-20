import React from 'react';
import Reflux from 'reflux';

import Colors from '../../styles/Colors.js';

import {Group, Shape} from 'react-art';

import Wire from './Wire.jsx';

import Constants from '../utils/Constants.js';
import {drawRectBetweenTwoPoints, PropTypes, makeArtListener, midPoint, diff} from '../utils/DrawingUtils.js';

const BOUNDING_BOX_WIDTH = Constants.RESISTOR.WIDTH + Constants.BOUNDING_BOX_PADDING * 2;

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
    this.setState({color: Colors.baser});
  },

  render() {
    const p1 = this.props.from,
          p2 = this.props.to,
          n = diff(p1, p2).normalize().multiply(Constants.RESISTOR.LENGTH / 2),
          mid = midPoint(p1, p2),
          r1 = mid.add(n),
          r2 = mid.subtract(n);

    const rectPath = drawRectBetweenTwoPoints(r1, r2, Constants.RESISTOR.WIDTH);

    return (
      <Group
        onClick={makeArtListener(this.highlight)}
        onMouseOver={() => console.log('group hovered')}
      >
        <Shape
          fill={Colors.transparent}
          stroke={this.state.color}
          strokeWidth={Constants.LINE_WIDTH}
          d={rectPath}
        />

        <Wire from={p1} to={r1} />
        <Wire from={p2} to={r2} />
        <Shape />
      </Group>
    );
  }
});
