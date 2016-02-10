import transforms from '../../../diagram/render/transforms';

import Vector from 'immutable-vector2d';

const STEM_SIZE = new Vector(6, 15);
const ARROW_LENGTH = 42;
const THING_LENGTH = 15;

const [tl, br] = [new Vector(0, 0), new Vector(50, 50)];
const tr = new Vector(br.x, tl.y);

const topPoint = tl.mix(tr, 0.25).snap(1); // snap to prevent blurriness

const bottomPoint = topPoint.add(new Vector(0, ARROW_LENGTH));
const rightPoint = topPoint.add(new Vector(1, 1).normalize(ARROW_LENGTH));

const stemTR = rightPoint.subtract(new Vector(THING_LENGTH, 0));
const stemTL = bottomPoint.add(new Vector(1, -1).normalize(THING_LENGTH));
const stemBL = stemTL.add(STEM_SIZE);
const stemBR = stemTR.add(STEM_SIZE);

const MOUSE_PATH = new Path2D();
MOUSE_PATH.moveTo(stemBL.x, stemBL.y);
MOUSE_PATH.lineTo(stemTL.x, stemTL.y);
MOUSE_PATH.lineTo(bottomPoint.x, bottomPoint.y);
MOUSE_PATH.lineTo(topPoint.x, topPoint.y);
MOUSE_PATH.lineTo(rightPoint.x, rightPoint.y);
MOUSE_PATH.lineTo(stemTR.x, stemTR.y);
MOUSE_PATH.lineTo(stemBR.x, stemBR.y);
MOUSE_PATH.closePath();

export default {
  transform: transforms.identity,

  render: (ctx, {colors}) => {
    ctx.strokeStyle = colors[0];
    ctx.stroke(MOUSE_PATH);
  }
};
