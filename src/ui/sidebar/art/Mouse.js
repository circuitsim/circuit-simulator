import React from 'react';
import {Shape, Path} from 'react-art';
import Vector from 'immutable-vector2d';
import Utils from '../../utils/DrawingUtils.js';

const STEM_SIZE = new Vector(6, 15);
const ARROW_LENGTH = 42;
const THING_LENGTH = 15;

export default class Mouse extends React.Component {

  render() {
    const [tl, br] = this.props.connectors,
          tr = new Vector(br.x, tl.y),

          topPoint = tl.mix(tr, 0.25).snap(1), // snap to prevent blurriness

          bottomPoint = topPoint.add(new Vector(0, ARROW_LENGTH)),

          stemTL = bottomPoint.add(new Vector(1, -1).normalize(THING_LENGTH)),
          stemBL = stemTL.add(STEM_SIZE),
          stemBR = stemBL.add(new Vector(4, -2)),
          stemTR = stemBR.subtract(STEM_SIZE),

          rightPoint = stemTR.add(new Vector(THING_LENGTH, 0));

    const path = new Path()
        .moveTo(topPoint.x, topPoint.y)
        .lineTo(bottomPoint.x, bottomPoint.y)
        .lineTo(stemTL.x, stemTL.y)
        .lineTo(stemBL.x, stemBL.y)
        .lineTo(stemBR.x, stemBR.y)
        .lineTo(stemTR.x, stemTR.y)
        .lineTo(rightPoint.x, rightPoint.y)
        .close();

    return (
      <Shape
        strokeWidth={this.props.theme.ART.LINE_WIDTH}
        stroke={this.props.color}
        strokeJoin='round'
        d={path}
      />
    );
  }
}

Mouse.propTypes = {
  connectors: React.PropTypes.arrayOf(Utils.PropTypes.Vector).isRequired,
  color: React.PropTypes.string.isRequired,
  theme: React.PropTypes.object.isRequired
};
