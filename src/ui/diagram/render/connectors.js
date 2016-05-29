import R from 'ramda';
import CircuitComponents from '../components';

const lookupComponent = viewProps => CircuitComponents[viewProps.typeID];

const TWO_PI = 2 * Math.PI;

const renderConnectors = (ctx) => (component) => {
  const ComponentType = lookupComponent(component);
  const { tConnectors } = component;

  ComponentType.transform.transformCanvas(ctx, component,
    () => {
      tConnectors.forEach((c) => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, 3, 0, TWO_PI);
        ctx.fill();
      });
    }
  );
};

export default function ({ctx, theme, components}) {
  const renderWithCtx = renderConnectors(ctx);

  ctx.save();
  ctx.fillStyle = theme.COLORS.base;
  components.forEach(renderWithCtx);

  ctx.fillStyle = theme.COLORS.highlight;
  const hoveredComponents = R.filter(c => c.hovered, components);
  hoveredComponents.forEach(renderWithCtx);

  ctx.restore();
}
