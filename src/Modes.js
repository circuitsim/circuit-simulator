import R from 'ramda';

const modeNames = [
  'add',
  'adding',
  'move',
  'moving'
];

export default R.zipObj(modeNames, modeNames);
