import R from 'ramda';
import CircuitComponents from '../components';
import drawConnectors from './connectors';

const TWO_PI = 2 * Math.PI;
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

const lookupComponent = viewProps => CircuitComponents[viewProps.typeID];

export default (store, ctx, theme) => {
  const renderWithProps = ({volts2RGB, circuitState}) => (component) => {
    const ComponentType = lookupComponent(component);

    const toRGB = volts2RGB(theme.COLORS);
    const voltages = circuitState[component.id].voltages;
    const colors = component.hovered
      ? R.repeat(theme.COLORS.highlight, ComponentType.numOfVoltages || 1)
      : R.map(toRGB, voltages);

    const props = {
      ...component,
      colors
    };

    ComponentType.transform.transformCanvas(ctx, props,
      () => ComponentType.render(ctx, props)
    );
  };

  const renderConnectors = (component) => {
    const ComponentType = lookupComponent(component);

    ComponentType.transform.transformCanvas(ctx, component,
      () => drawConnectors(ctx, component)
    );
  };

  const renderDragPoint = (dragPoint) => {
    ctx.beginPath();
    ctx.arc(dragPoint.x, dragPoint.y, 4, 0, TWO_PI);
    ctx.fill();
  };

  const renderDragPoints = (viewsList) => {
    const hoveredComponents = R.filter(c => c.hovered, viewsList);
    hoveredComponents.forEach((comp) => {
      ctx.fillStyle = theme.COLORS.transBase;
      comp.dragPoints.forEach(renderDragPoint);
    });

    const comp = R.find(c => c.dragPointIndex !== false, hoveredComponents);
    if (comp) {
      const dragPoint = comp.dragPoints[comp.dragPointIndex];

      ctx.fillStyle = theme.COLORS.highlight;
      renderDragPoint(dragPoint);
    }
  };

  const renderAllConnectors = (viewsList) => {
    ctx.save();
    ctx.fillStyle = theme.COLORS.base;
    viewsList.forEach(renderConnectors);

    ctx.fillStyle = theme.COLORS.highlight;
    const hoveredComponents = R.filter(c => c.hovered, viewsList);
    hoveredComponents.forEach(renderConnectors);

    ctx.restore();
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

    const viewsList = R.values(views);
    // TODO colors = calculateColors()
    const renderView = renderWithProps({volts2RGB, circuitState});
    viewsList.forEach(renderView);

    renderAllConnectors(viewsList);

    renderDragPoints(viewsList);

    // TODO
    // render labels
    // render currentDots
  };

  initCanvas(ctx, theme);

  return render;
};
