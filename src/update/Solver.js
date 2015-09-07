import Analyser from 'circuit-analysis';
import {Functions} from '../ui/diagram/components/models/Models.js';
import R from 'ramda';

import {hasPathProblem} from './Paths.js';

const {stamp} = Functions;

export function getCircuitInfo(circuit) {
  function addVSources(n, m) {
    return n + (m.vSources || 0);
  }
  return {
    numOfNodes: Object.keys(circuit.nodes).length,
    numOfVSources: R.reduce(addVSources, 0, Object.values(circuit.models))
  };
}

function blankSolution(circuitInfo) {
  // just return a blank solution (zeros for voltages/currents)
  const n = Math.max(0, circuitInfo.numOfNodes + circuitInfo.numOfVSources - 1);
  return Array.fill(new Array(n), 0);
}

function anError(circuitInfo, error) {
  return {
    solution: blankSolution(circuitInfo),
    error
  };
}

export function solveCircuit(circuit, circuitInfo) {
  try {
    const problem = hasPathProblem(circuit);
    if (problem) {
      return anError(circuitInfo, problem);
    }

    const {solve, stamp: stamper} = Analyser.createEquationBuilder(circuitInfo);
    R.forEach(model => {
      stamp(model, stamper);
    }, R.values(circuit.models));

    const solution = R.flatten(solve()()); // flatten single column matrix into array
    if (R.any(isNaN, solution)) {
      return anError(circuitInfo, 'Error: Solution contained NaNs');
    }

    return {
      solution: solution,
      error: false
    };
  } catch(e) {
    // if we can't solve, there's probably something wrong with the circuit
    return anError(circuitInfo, e);
  }
}
