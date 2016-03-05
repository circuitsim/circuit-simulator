import { CURRENT } from '../Constants';

import CircuitComponents from '../components';
const lookupComponent = viewProps => CircuitComponents[viewProps.typeID];

const STANDING_OFFSET = CURRENT.DOT_DISTANCE / 2;
const TWO_PI = 2 * Math.PI;

const distance = (v1, v2) => {
  const d = {
    x: v1.x - v2.x,
    y: v1.y - v2.y
  };
  return Math.sqrt(d.x * d.x + d.y * d.y);
};

const lerp = (n1, n2, d) => ((1 - d) * n1) + (d * n2);

const getOffset = (currentOffset, current) => {
  const fiddleCurrent = current / 10; // FIXME no magic fiddles

  let offset = (fiddleCurrent * currentOffset + STANDING_OFFSET) % CURRENT.DOT_DISTANCE;
  offset = current >= 0
    ? offset
    : offset + CURRENT.DOT_DISTANCE;

  return offset;
};

const renderCurrent = (ctx, currentOffset, circuitState) => (component) => {
  const renderBetween = (p1, p2, current) => {
    const startPos = getOffset(currentOffset, current);

    const length = distance(p1, p2);
    for (let position = startPos; position <= length; position += CURRENT.DOT_DISTANCE) {
      const d = position / length;
      const x = lerp(p1.x, p2.x, d);
      const y = lerp(p1.y, p2.y, d);

      ctx.beginPath();
      ctx.arc(x, y, CURRENT.RADIUS, 0, TWO_PI);
      ctx.fill();
    }
  };

  const ComponentType = lookupComponent(component);
  ComponentType.renderCurrent(component, circuitState[component.id], renderBetween);
};

export default function ({ctx, theme, currentOffset, circuitState, components}) {
  const render = renderCurrent(ctx, currentOffset, circuitState);

  ctx.save();
  ctx.fillStyle = theme.COLORS.current;

  components.forEach(component => {
    const ComponentType = lookupComponent(component);
    ComponentType.transform.transformCanvas(ctx, component,
      () => render(component)
    );
  });

  ctx.restore();
}
