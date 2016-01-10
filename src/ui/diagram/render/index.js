import R from 'ramda';
import CircuitComponents from '../components';
import highlightOnHover from './highlightOnHover';

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
  const modifiers = [
    highlightOnHover
  ];
  const renderComponent = R.converge(
    createComponentRenderer(ctx, modifiers),
    [ lookupComponent,
      R.merge({theme})
    ]
  );
  const renderComponents = R.pipe(
    R.values,
    R.forEach(renderComponent)
  );

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

    renderComponents(views);
    // TODO
    // render labels
    // render currentDots
    // render dragPoints

  };

  initCanvas(ctx, theme);

  return render;
};
