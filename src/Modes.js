import R from 'ramda';

const modeNames = [
  'add',
  'adding',
  'select' // does nothing ATM
];

export const MODES = R.zipObj(modeNames, modeNames);
