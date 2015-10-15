import R from 'ramda';

import { hoverFor } from '../../ui/diagram/boundingBox.js';

export default function setHover(state) {
  const { views, mousePos, hover } = state;

  const getHoverInfo = hoverFor(mousePos);
  const addHoverInfo = view => {
    const { typeID, props: { dragPoints }} = view;
    const { hovered, dragPointIndex } = getHoverInfo(typeID, dragPoints);
    return {
      viewID: view.id,
      hovered,
      dragPointIndex
    };
  };

  const isHovered = hoverInfo => hoverInfo.hovered;

  const moreThanOne = R.pipe(
    R.length,
    R.gt(R.__, 1) // eslint-disable-line no-underscore-dangle
  );

  const pickBest = R.reduce((currentBest, hoverInfo) => {
    // TODO what if a big component completely covers a smaller one?
    // - we should have a bias for smaller components
    // TODO ugh nested ternaries - not clear what's going on or why
    return currentBest.viewID
      ? currentBest.viewID === hoverInfo.viewID
        ? hoverInfo
        : currentBest
      : hoverInfo;
  }, hover); // prefer currently hovered view

  const hoverInfo = R.pipe(
    R.map(addHoverInfo),
    R.filter(isHovered),
    R.ifElse(moreThanOne, pickBest, R.head)
  )(R.values(views))
  || {};

  return R.assoc('hover', hoverInfo, state);
}
