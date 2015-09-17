import R from 'ramda';

const modeNames = [
  'add',
  'adding',
  'move' // does nothing ATM
];

export default R.zipObj(modeNames, modeNames);
