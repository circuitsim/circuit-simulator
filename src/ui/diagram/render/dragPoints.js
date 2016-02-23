import R from 'ramda';

const TWO_PI = 2 * Math.PI;

const renderDragPoint = (ctx) => (dragPoint) => {
  ctx.beginPath();
  ctx.arc(dragPoint.x, dragPoint.y, 5, 0, TWO_PI);
  ctx.fill();
};

export default function ({ctx, theme, components}) {
  const renderWithCtx = renderDragPoint(ctx);

  const hoveredComponents = R.filter(c => c.hovered, components);
  hoveredComponents.forEach((comp) => {
    ctx.fillStyle = theme.COLORS.transBase;
    comp.dragPoints.forEach(renderWithCtx);
  });

  const comp = R.find(c => c.dragPointIndex !== false, hoveredComponents);
  if (comp) {
    const dragPoint = comp.dragPoints[comp.dragPointIndex];

    ctx.fillStyle = theme.COLORS.highlight;
    renderWithCtx(dragPoint);
  }
}
