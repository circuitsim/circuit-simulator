import React from 'react';

import {Group} from 'react-art';

import Circle from 'react-art/shapes/circle';
import MetricsPath from 'art/metrics/path';

import {PropTypes, diff} from './utils/DrawingUtils.js';
import {CURRENT} from '../utils/Constants.js';

import Colors from '../styles/Colors.js';

/**
 * Displays current flow along a path.
 */
export default class CurrentPath extends React.Component {

  render() {
    const [end1, end2] = this.props.connectors,
          d = diff(end1, end2),

          path = new MetricsPath()
            .moveTo(end1.x, end1.y)
            .lineTo(end2.x, end2.y),

          current = this.props.current,

          /* map from log10 to logbase scale, e.g. for base = 2, a mapping of:
           * 1    -> 1
           * 0.1  -> 0.5
           * 0.01 -> 0.25
           */
          base = Math.E,
          mappedCurrent = Math.sign(current) * Math.pow(base, Math.log10(Math.abs(current))),

          fiddleCurrent = mappedCurrent / 10, // FIXME no magic fiddles

          offset = (fiddleCurrent * this.context.animContext.currentOffset) % CURRENT.DOT_DISTANCE,
          startPos = current >= 0
            ? offset
            : offset + CURRENT.DOT_DISTANCE,

          circles = [];

    for (let position = startPos; position < d.length(); position += CURRENT.DOT_DISTANCE) {
      circles.push(
        React.createElement(Circle, {
          key: position,
          radius: CURRENT.RADIUS,
          fill: Colors.current,
          transform: path.point(position)
        })
      );
    }

    return (
      <Group>
        {circles ? circles : null}
      </Group>
    );
  }
}

CurrentPath.propTypes = {
  connectors: React.PropTypes.arrayOf(PropTypes.Vector).isRequired,
  current: React.PropTypes.number
};

CurrentPath.defaultProps = {
  current: 0
};

CurrentPath.contextTypes = {
  animContext: React.PropTypes.shape({
    currentOffset: React.PropTypes.number
  })
};
