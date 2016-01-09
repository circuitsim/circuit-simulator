
const clearCanvas = ctx => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  ctx.clearRect(0, 0, width, height);
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
    // renderComponents(ctx, )
    // render labels
    // render currentDots
    // render dragPoints

  };

  // Save initial canvas state
  ctx.fillStyle = theme.COLORS.base;
  ctx.strokeStyle = theme.COLORS.base;
  ctx.save();

  return render;
};
