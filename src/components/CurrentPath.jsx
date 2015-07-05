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

          offset = (this.props.current * this.context.animContext.currentOffset) % CURRENT.DOT_DISTANCE, // TODO
          startPos = this.props.current >= 0
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
  current: 0.05
};

// CurrentPath.contextTypes = {
//   animContext: React.PropTypes.shape({
//     currentOffset: React.PropTypes.number
//   })
// };
