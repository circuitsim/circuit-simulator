import R from 'ramda';

import renderViews from './components';
import renderConnectors from './connectors';
import renderDragPoints from './dragPoints';
import renderLabels from './labels';
import renderCurrent from './current';

import {LINE_WIDTH} from '../Constants';

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

export default (store, ctx, theme) => {

  const render = () => {
    const {
      views,
      circuit: {
        components: circuitState,
        // error,
        volts2RGB
      }
    } = store.getState();

    clearCanvas(ctx);

    const viewsList = R.values(views);
    // TODO colors = calculateColors()

    renderViews({ctx, theme, volts2RGB, circuitState, components: viewsList});
    renderConnectors({ctx, theme, components: viewsList});
    renderDragPoints({ctx, theme, components: viewsList});
    renderLabels({ctx, theme, components: viewsList});
    renderCurrent({ctx, theme, circuitState, components: viewsList});
  };

  initCanvas(ctx, theme);

  return render;
};
