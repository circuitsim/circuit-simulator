import R from 'ramda';

const modeNames = [
  'add',
  'adding',
  'select' // does nothing ATM
];

export default R.zipObj(modeNames, modeNames);
