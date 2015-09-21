import R from 'ramda';

import CurrentSource from './CurrentSource.js';
import Ground from './Ground.js';
import Resistor from './Resistor.js';
import Wire from './Wire.js';

const VIEWS = [
  CurrentSource,
  Ground,
  Resistor,
  Wire
];

function toKVPair(component) {
  return [component.typeID, component];
}

// Map from typeID to component
export default R.pipe(
  R.map(toKVPair),
  R.fromPairs
)(VIEWS);
