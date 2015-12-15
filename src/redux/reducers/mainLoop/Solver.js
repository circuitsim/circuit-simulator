import R from 'ramda';
import createEquationBuilder from 'circuit-analysis';

import { Functions } from '../../../ui/diagram/components/models';

import { hasPathProblem, connectDisconnectedCircuits } from './Paths.js';

const { stamp, stampDynamic } = Functions;

export function getCircuitInfo({nodes, models}) {
  function addVSources(n, m) {
    return n + (m.vSources || 0);
  }
  return {
    numOfNodes: R.length(nodes),
    numOfVSources: R.reduce(addVSources, 0, R.values(models))
  };
}

function blankSolution(equation) {
  // just return a blank solution (zeros for voltages/currents)
  const n = equation.getEquation().inputs().length;
  return R.repeat(0, n);
}

function anError(equation, error) {
  return {
    solution: blankSolution(equation),
    error
  };
}

export function checkForProblems(circuit) {
  if (circuit.numOfNodes < 2) {
    return 'Not enough nodes for a circuit';
  }
  const problem = hasPathProblem(circuit);
  if (problem) {
    return problem;
  }
  return false;
}

// Creates a partial equation with all the static parts of the circuit stamped
export function stampStaticEquation(circuit) {
  const equation = createEquationBuilder(circuit);
  R.forEach(model => {
    stamp(model, equation);
  }, R.values(circuit.models));

  connectDisconnectedCircuits(circuit, equation);

  return equation;
}

// Takes the static partial equation and stamps the time-varying parts of the circuit
// FIXME this mutates equation
export function stampDynamicEquation(circuit, equation, timestep, previousCircuitState) {
  R.forEach(model => {
    const previousModelState = previousCircuitState[model.id];
    stampDynamic(model, equation, previousModelState, timestep);
  }, R.values(circuit.models));
  return equation;
}

export function solveEquation(equation) {
  try {
    const solution = R.flatten(equation.solve()()); // flatten single column matrix into array

    if (R.any(isNaN, solution)) {
      return anError(equation, 'Error: Solution contained NaNs');
    }

    return {
      solution: solution,
      error: false
    };
  } catch(e) {
    // if we can't solve, there's probably something wrong with the circuit
    return anError(equation, e);
  }
}
