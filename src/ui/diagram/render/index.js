import R from 'ramda';
import CircuitComponents from '../components';

export const LINE_WIDTH = 2;

export const clearCanvas = ctx => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  ctx.clearRect(0, 0, width, height);
};

export const initCanvas = (ctx, theme) => {
  ctx.fillStyle = theme.COLORS.base;
  ctx.strokeStyle = theme.COLORS.base;
  ctx.lineWidth = LINE_WIDTH;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.save();
};

const composeList = R.apply(R.compose);

export const createComponentRenderer = (ctx, modifiers = []) => (Component, props) => {
  // MODIFIER :: (ctx, props) => next => () => void
  const modConstructors = [
    Component.transform.transformCanvas,
    ...modifiers
  ];
  const createRenderer = create => create(ctx, props);

  const wrap = R.pipe(
    R.map(createRenderer),
    composeList,
  )(modConstructors);

  const renderComponent = () => Component.render(ctx, props);
  const render = wrap(renderComponent);

  render();
};

const lookupComponent = viewProps => CircuitComponents[viewProps.typeID];

export default (store, ctx, theme) => {
  const modifiers = [];
  const renderComponent = createComponentRenderer(ctx, modifiers);

  const renderWithProps = ({volts2RGB, circuitState}) => (component) => {
    const ComponentType = lookupComponent(component);

    const toRGB = volts2RGB(theme.COLORS);
    const voltages = circuitState[component.id].voltages;
    const colors = component.hovered
      ? R.repeat(theme.COLORS.highlight, ComponentType.numOfVoltages || 1)
      : R.map(toRGB, voltages);

    renderComponent(ComponentType, {
      ...component,
      colors
    });
  };

  const render = () => {
    const {
      views,
      circuit: {
        components: circuitState,
        error,
        currentOffset,
        volts2RGB
      }
    } = store.getState();

    clearCanvas(ctx);

    const renderView = renderWithProps({volts2RGB, circuitState});
    R.values(views).forEach(renderView);

    // TODO
    // render labels
    // render currentDots
    // render dragPoints

  };

  initCanvas(ctx, theme);

  return render;
};
