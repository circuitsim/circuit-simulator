import R from 'ramda';
import createEquationBuilder from 'circuit-analysis';

import { Functions } from '../../../ui/diagram/components/models';

import { hasPathProblem, connectDisconnectedCircuits } from './Paths.js';

const { stamp } = Functions;

export function getCircuitInfo({nodes, models}) {
  function addVSources(n, m) {
    return n + (m.vSources || 0);
  }
  return {
    numOfNodes: R.length(nodes),
    numOfVSources: R.reduce(addVSources, 0, R.values(models))
  };
}

function blankSolution(circuit) {
  // just return a blank solution (zeros for voltages/currents)
  const n = Math.max(0, circuit.numOfNodes + circuit.numOfVSources - 1);
  return R.repeat(0, n);
}

function anError(circuit, error) {
  return {
    solution: blankSolution(circuit),
    error
  };
}

export function solveCircuit(circuit) {
  try {
    const problem = hasPathProblem(circuit);
    if (problem) {
      return anError(circuit, problem);
    }

    const equation = createEquationBuilder(circuit);
    R.forEach(model => {
      stamp(model, equation);
    }, R.values(circuit.models));

    connectDisconnectedCircuits(circuit, equation);

    const solution = R.flatten(equation.solve()()); // flatten single column matrix into array

    if (R.any(isNaN, solution)) {
      return anError(circuit, 'Error: Solution contained NaNs');
    }

    return {
      solution: solution,
      error: false
    };
  } catch(e) {
    // if we can't solve, there's probably something wrong with the circuit
    return anError(circuit, e);
  }
}
