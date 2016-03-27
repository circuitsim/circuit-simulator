import R from 'ramda';

import Capacitor from './Capacitor';
import CurrentSource from './CurrentSource';
import VoltageSource from './VoltageSource';
import Ground from './Ground';
import Resistor from './Resistor';
import Wire from './Wire';

const VIEWS = [
  Capacitor,
  CurrentSource,
  VoltageSource,
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
