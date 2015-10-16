import R from 'ramda';

const modeNames = [
  'add',
  'adding',
  'selectOrMove',
  'moving'
];

export default R.zipObj(modeNames, modeNames);
