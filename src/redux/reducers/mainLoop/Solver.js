import R from 'ramda';
import Analyser from 'circuit-analysis';

import { Functions } from '../../../ui/diagram/components/models/AllModels.js';

import { hasPathProblem } from './Paths.js';

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
  return Array.fill(new Array(n), 0);
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

    const {solve, stamp: stamper} = Analyser.createEquationBuilder(circuit);
    R.forEach(model => {
      stamp(model, stamper);
    }, R.values(circuit.models));

    // TODO connect disconnected graph
    // connectDisconnectedCircuits(circuit, stamper);

    const solution = R.flatten(solve()()); // flatten single column matrix into array

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
