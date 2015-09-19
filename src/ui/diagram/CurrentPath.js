import React from 'react';
import {Group} from 'react-art';
import Circle from 'react-art/shapes/circle';
import MetricsPath from 'art/metrics/path';
import Utils from '../utils/DrawingUtils.js';

import { CURRENT } from './Constants.js';

/**
 * Displays current flow along a path.
 */
const CurrentPath = (
    {
      current = 0,
      connectors,
      theme
    },
    context
  ) => {
  const circles = [],
        showCurrent = !(context && context.disableCurrent);
  if (showCurrent) {
    const [end1, end2] = connectors,
          d = Utils.diff(end1, end2),

          path = new MetricsPath()
            .moveTo(end1.x, end1.y)
            .lineTo(end2.x, end2.y),

          fiddleCurrent = current / 10, // FIXME no magic fiddles

          offset = (fiddleCurrent * context.animContext.currentOffset) % CURRENT.DOT_DISTANCE,
          startPos = current >= 0
            ? offset
            : offset + CURRENT.DOT_DISTANCE;

    for (let position = startPos; position < d.length(); position += CURRENT.DOT_DISTANCE) {
      circles.push(
        React.createElement(Circle, {
          key: position,
          radius: CURRENT.RADIUS,
          fill: theme.COLORS.current,
          transform: path.point(position)
        })
      );
    }
  }
  return (
    <Group>
      {circles ? circles : null}
    </Group>
  );
};

CurrentPath.propTypes = {
  connectors: React.PropTypes.arrayOf(Utils.PropTypes.Vector).isRequired,
  current: React.PropTypes.number,
  theme: React.PropTypes.object.isRequired
};

CurrentPath.contextTypes = {
  animContext: React.PropTypes.shape({
    currentOffset: React.PropTypes.number
  }),
  disableCurrent: React.PropTypes.bool // can't set defaultContext so defaults to falsy
};

export default CurrentPath;
