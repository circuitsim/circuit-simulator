import Vector from 'immutable-vector2d';
import {formatSI} from 'format-si-prefix';

import { LINE_WIDTH } from '../Constants';

import { midPoint, direction } from '../../utils/DrawingUtils.js';

import CircuitComponents from '../components';
const lookupComponent = viewProps => CircuitComponents[viewProps.typeID];

const FONT_SIZE = 10;
const FONT = `${FONT_SIZE}px "Arial"`;

const renderLabel = (ctx) => (component) => {
  const {
    defaultEditables,
    editablesSchema,
    labelWith,
    width
  } = lookupComponent(component);
  const {
    dragPoints,
    editables = defaultEditables
  } = component;

  if (!labelWith) {
    return;
  }

  const {value} = editables[labelWith];
  const {unit} = editablesSchema[labelWith];
  const label = formatSI(value) + (unit || '');

  const mid = midPoint(...dragPoints),
        dir = direction(...dragPoints),
        offsetDir = dir.perpendicular().invert(),
        offsetAngle = dir.angle(),
        offsetLength = (width / 2) + LINE_WIDTH,
        edge = offsetDir.multiply(offsetLength),

        textWidth = ctx.measureText(label).width,
        extraX = Math.sin(offsetAngle) * (textWidth / 2),
        extraY = -Math.cos(offsetAngle) * (FONT_SIZE / 2),

        offset = edge.add(new Vector(extraX, extraY)),

        textPos = mid.add(offset);

  ctx.fillText(label, textPos.x, textPos.y);
};

export default function({ ctx, theme, components }) {
  const renderLabelWithCtx = renderLabel(ctx);

  ctx.save();
  ctx.fillStyle = theme.COLORS.base;
  ctx.font = FONT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  components.forEach(renderLabelWithCtx);

  ctx.restore();
}
