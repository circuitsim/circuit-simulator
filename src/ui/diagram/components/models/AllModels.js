import R from 'ramda';

import CurrentSource from './CurrentSource.js';
import VoltageSource from './VoltageSource.js';
import Ground from './Ground.js';
import Resistor from './Resistor.js';
import Wire from './Wire.js';

// These keys are used to identify the typeID for each component model
const MODELS = {
  CurrentSource,
  VoltageSource,
  Ground,
  Resistor,
  Wire
};

function setKeyAsTypeID(model, typeID) {
  const modelData = model.data;
  modelData.typeID = typeID;
  return modelData;
}

/**
 * Map from typeID to default data
 */
export const BaseData = R.mapObjIndexed(setKeyAsTypeID, MODELS);

const ComponentFunctions = R.mapObj((modelData) => {
  return modelData.functions;
}, MODELS);

const functionFor = fName => (modelData, ...args) => {
  const component = ComponentFunctions[modelData.typeID];
  const componentFunction = component[fName];
  return componentFunction(modelData, ...args);
};

const commonFunctionNames = [
  'stamp'
];

/**
 * Common functions that can be called on the data.
 * Example:
 * Functions.stamp(modelData, stamper);
 */
export const Functions = R.pipe(
  R.map(fName => [fName, functionFor(fName)]),
  R.fromPairs
)(commonFunctionNames);
