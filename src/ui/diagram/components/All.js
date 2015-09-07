import R from 'ramda';

import CurrentSource from './CurrentSource.js';
import Resistor from './Resistor.js';
import Wire from './Wire.js';

// Use 'typeID' as a way to identify component type, whether view or model
function addTypeID(component) {
  component.typeID = component.model.typeID;
  return component;
}

// FIXME I've assumed that component views are indexed by their typeID but this is not enforced
// All elements should be imported from here so the type ID is included
export default R.mapObj(addTypeID, {
  CurrentSource,
  Resistor,
  Wire
});
