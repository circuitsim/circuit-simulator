import React from 'react';
import {Shape, Group, Path, Transform} from 'react-art';

import { LINE_WIDTH } from '../Constants.js';

import {PropTypes} from './DrawingUtils.js';

const Circle = ({
    center,
    lineColor
  }) => {
  const smallLine = new Path()
    .moveTo(LINE_WIDTH * 2, 0)
    .lineTo(-LINE_WIDTH * 2, 0)
    .close();

  const rotate90 = new Transform().rotate(90);
  return (
    <Group x={center.x} y={center.y} >
      <Shape
        strokeWidth={LINE_WIDTH}
        stroke={lineColor}
        strokeJoin='round'
        d={smallLine}
      />
      <Shape
        strokeWidth={LINE_WIDTH}
        stroke={lineColor}
        strokeJoin='round'
        d={smallLine}
        transform={rotate90}
      />
    </Group>
  );
};

Circle.propTypes = {
  center: PropTypes.Vector,
  lineColor: React.PropTypes.string
};

export default Circle;
