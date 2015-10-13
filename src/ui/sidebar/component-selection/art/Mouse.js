import React from 'react';
import {Shape, Path} from 'react-art';
import Vector from 'immutable-vector2d';

import Utils from '../../../utils/DrawingUtils.js';
import { LINE_WIDTH } from '../../../Constants.js';
import { get2ConnectorsFromDragPoints } from '../../../diagram/Utils.js';


const STEM_SIZE = new Vector(6, 15);
const ARROW_LENGTH = 42;
const THING_LENGTH = 15;

const Mouse = ({connectors, colors}) => {
  const [tl, br] = connectors,
        tr = new Vector(br.x, tl.y),

        topPoint = tl.mix(tr, 0.25).snap(1), // snap to prevent blurriness

        bottomPoint = topPoint.add(new Vector(0, ARROW_LENGTH)),
        rightPoint = topPoint.add(new Vector(1, 1).normalize(ARROW_LENGTH)),

        stemTR = rightPoint.subtract(new Vector(THING_LENGTH, 0)),
        stemTL = bottomPoint.add(new Vector(1, -1).normalize(THING_LENGTH)),
        stemBL = stemTL.add(STEM_SIZE),
        stemBR = stemTR.add(STEM_SIZE);

  const path = new Path()
      .moveTo(stemBL.x, stemBL.y)
      .lineTo(stemTL.x, stemTL.y)
      .lineTo(bottomPoint.x, bottomPoint.y)
      .lineTo(topPoint.x, topPoint.y)
      .lineTo(rightPoint.x, rightPoint.y)
      .lineTo(stemTR.x, stemTR.y)
      .lineTo(stemBR.x, stemBR.y)
      .close();

  return (
    <Shape
      strokeWidth={LINE_WIDTH}
      stroke={colors[0]}
      strokeJoin='round'
      d={path}
    />
  );
};

Mouse.propTypes = {
  connectors: React.PropTypes.arrayOf(Utils.PropTypes.Vector).isRequired,
  colors: React.PropTypes.arrayOf(React.PropTypes.string)
};

Mouse.getConnectorPositions = get2ConnectorsFromDragPoints;

export default Mouse;
