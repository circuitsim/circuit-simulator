import R from 'ramda';
import MODELS from './Models.js';

function setKeyAsTypeID(model, typeID) {
  const modelData = model.data;
  modelData.typeID = typeID;
  return modelData;
}

/**
 * List of default data for each model typeID.
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
