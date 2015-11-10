import React from 'react';
import {Group} from 'react-art';
import Circle from 'react-art/shapes/circle';
import MetricsPath from 'art/metrics/path';
import Utils from '../utils/DrawingUtils.js';
import { CURRENT } from './Constants.js';

const STANDING_OFFSET = CURRENT.DOT_DISTANCE / 2;

/**
 * Displays current flow along a path.
 */
const CurrentPath = (
    {
      current = 0,
      currentOffset,
      endPoints
    },
    {
      disableCurrent = false,
      theme
    }
  ) => {
  const circles = [],
        showCurrent = !disableCurrent;
  if (showCurrent) {
    const [end1, end2] = endPoints,
          d = Utils.diff(end1, end2),

          path = new MetricsPath()
            .moveTo(end1.x, end1.y)
            .lineTo(end2.x, end2.y),

          fiddleCurrent = current / 10, // FIXME no magic fiddles

          offset = (fiddleCurrent * currentOffset + STANDING_OFFSET) % CURRENT.DOT_DISTANCE,
          startPos = current >= 0
            ? offset
            : offset + CURRENT.DOT_DISTANCE;

    for (let position = startPos, key = 0; position <= d.length(); position += CURRENT.DOT_DISTANCE, key++) {
      // TODO pool Circle instances?
      circles.push(
        <Circle
          key={key}
          radius={CURRENT.RADIUS}
          fill={theme.COLORS.current}
          transform={path.point(position)}
        />
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
  endPoints: React.PropTypes.arrayOf(Utils.PropTypes.Vector).isRequired,
  current: React.PropTypes.number,
  currentOffset: React.PropTypes.number
};

CurrentPath.contextTypes = {
  disableCurrent: React.PropTypes.bool, // can't set defaultContext so defaults to falsy
  theme: React.PropTypes.object.isRequired
};

export default CurrentPath;
