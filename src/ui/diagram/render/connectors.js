
const TWO_PI = 2 * Math.PI;

export default (ctx, props) => {
  const { connectors } = props;

  connectors.forEach((c) => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, 3, 0, TWO_PI);
    ctx.fill();
  });
};
