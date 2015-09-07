import R from 'ramda';

import CurrentSource from './CurrentSource.js';
import Resistor from './Resistor.js';
import Wire from './Wire.js';

function toKVPair(component) {
  return [component.typeID, component];
}

// Map from typeID to component
export default R.pipe(
  R.map(toKVPair),
  R.fromPairs
)([
  CurrentSource,
  Resistor,
  Wire
]);
