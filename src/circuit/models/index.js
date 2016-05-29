import R from 'ramda';

import Capacitor from './Capacitor';
import Inductor from './Inductor';
import CurrentSource from './CurrentSource';
import VoltageSource from './VoltageSource';
import Ground from './Ground';
import Resistor from './Resistor';
import Wire from './Wire';

// These keys are used to identify the typeID for each component model
const MODELS = {
  Capacitor,
  Inductor,
  CurrentSource,
  VoltageSource,
  Ground,
  Resistor,
  Wire
};

const commonFunctionNames = [
  /*
   * Stamp the static parts of a component that don't change.
   *
   * Components that change over time, (e.g. sine wave sources,
   * capacitors), or need linearization (e.g. diodes) don't
   * stamp here.
   *
   * Called whenever the circuit is modified.
   *
   * (data, equation) => ()
   */
  'stamp',

  /*
   * Stamp the parts of a component that vary over time.
   *
   * Components such as capacitors depend on:
   * - time since last update (timestep)
   * - their previously analysed voltage/current (previousState)
   *
   * Called before the Newton-Raphson linearization steps
   * on every update.
   *
   * Returns a function which calculates the current, given
   * the solution voltages.
   *
   * (data, equation, previousState, timestep, simTime) => ([volts] => [currents])
   */
  'stampDynamic',

  /*
   * Stamp linearized versions of non-linear components based
   * on previously analysed state and a new guessed state.
   *
   * Called every iteration of the Newton-Raphson loop.
   *
   * (data, equation, previousState, guessedNewState) => ()
   */
  'stampLinearized'
];

function setKeyAsTypeID(model, typeID) {
  const modelData = model.data;
  modelData.typeID = typeID;
  return modelData;
}

/**
 * Map from typeID to default data
 */
export const BaseData = R.mapObjIndexed(setKeyAsTypeID, MODELS);

const ComponentFunctions = R.map((model) => {
  return model.functions;
}, MODELS);

const functionFor = funcName => (modelData, ...args) => {
  const componentFunction = ComponentFunctions[modelData.typeID][funcName];
  return componentFunction
    ? componentFunction(modelData, ...args)
    : undefined;
};

/**
 * Common functions that can be called on the data.
 * Example:
 * Functions.stamp(modelData, equation);
 */
export const Functions = R.pipe(
  R.map(funcName => [funcName, functionFor(funcName)]),
  R.fromPairs
)(commonFunctionNames);
