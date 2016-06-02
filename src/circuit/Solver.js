import R from 'ramda';

import { createBlankEquation, solve } from './equation';
import { BaseData as Models, Functions } from './models';

import { hasPathProblem } from './Paths.js';

const { stamp, stampDynamic } = Functions;

export function getCircuitInfo({nodes, models}) {
  function addVSources(n, m) {
    return n + (m.numVoltSources || 0);
  }
  return {
    numOfNodes: R.length(nodes),
    numOfVSources: R.reduce(addVSources, 0, R.values(models))
  };
}

export function blankSolutionForCircuit(circuitInfo) {
  const n = circuitInfo.numOfNodes + circuitInfo.numOfVSources;
  return R.repeat(0, n);
}

const isResistor = model => model.typeID === Models.Resistor.typeID;
const invalidResistance = model => model.editables.resistance.value <= 0;
const anyZeroResistances = R.pipe(
  R.values,
  R.filter(isResistor),
  R.any(invalidResistance)
);

export function checkForProblems(circuit) {
  if (circuit.numOfNodes < 2) {
    return 'Not enough nodes for a circuit';
  }
  if (anyZeroResistances(circuit.models)) {
    return 'Zero-valued resistance';
  }
  const problem = hasPathProblem(circuit);
  if (problem) {
    return problem;
  }
  return false;
}

// Creates a partial equation with all the static parts of the circuit stamped
export function stampStaticEquation(circuit) {
  const { models, numOfNodes, numOfVSources } = circuit;
  const equation = createBlankEquation({numOfNodes, numOfVSources});
  R.forEach(model => {
    stamp(model, equation);
  }, R.values(models));
  return equation;
}

// Takes the static partial equation and stamps the time-varying parts of the circuit
export function stampDynamicEquation(circuit, equation, timestep, simTime, previousCircuitState) {
  const currentCalculators = {};
  R.forEach(modelID => {
    const model = circuit.models[modelID];
    const previousModelState = previousCircuitState[modelID];
    const calcCurrent = stampDynamic(model, equation, previousModelState, timestep, simTime);
    currentCalculators[modelID] = calcCurrent;
  }, R.keys(circuit.models));
  return currentCalculators;
}

export function solveEquation(equation) {
  const solution = R.flatten(solve(equation)); // flatten single column matrix into array

  if (R.any(isNaN, solution)) {
    throw new Error('Solution contained NaNs');
  }

  return solution;
}
