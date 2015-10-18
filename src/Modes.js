import R from 'ramda';

const modeNames = [
  'add',
  'adding',
  'selectOrMove',
  'selectOrMoveMouseDown',
  'moving'
];

export default R.zipObj(modeNames, modeNames);
