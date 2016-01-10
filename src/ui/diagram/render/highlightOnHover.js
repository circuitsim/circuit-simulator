
export default (ctx, props) => next => () => {
  const { theme: { COLORS }, hovered } = props;

  if (hovered) {
    ctx.save();
    ctx.fillStyle = COLORS.highlight;
    ctx.strokeStyle = COLORS.highlight;

    next();

    ctx.restore();
  } else {
    next();
  }
};
