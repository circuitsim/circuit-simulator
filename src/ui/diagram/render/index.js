import R from 'ramda';
import CircuitComponents from '../components';

export const LINE_WIDTH = 2;

const clearCanvas = ctx => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  ctx.clearRect(0, 0, width, height);
};

export const initCanvas = (ctx, theme) => {
  ctx.fillStyle = theme.COLORS.base;
  ctx.strokeStyle = theme.COLORS.base;
  ctx.lineWidth = LINE_WIDTH;
  ctx.lineJoin = 'round';
  ctx.save();
};

export const renderComponent = ctx => (Component, props) => {
  const transform = Component.transform.transformCanvas(ctx);
  const render = transform(Component.render(ctx));
  render(props);
};

const renderComponents = (ctx, views) => {
  const render = renderComponent(ctx);
  R.forEach(viewProps => {
    const Component = CircuitComponents[viewProps.typeID];
    render(Component, viewProps);
  }, R.values(views));
};

export default (store, ctx, theme) => {
  const render = () => {
    const {
      views,
      circuit: {
        components: circuitState,
        error,
        currentOffset,
        volts2RGB
      },
      hover
    } = store.getState();

    clearCanvas(ctx);

    // TODO
    renderComponents(ctx, views);
    // render labels
    // render currentDots
    // render dragPoints

  };

  initCanvas(ctx, theme);

  return render;
};
