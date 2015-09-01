import Analyser from 'circuit-analysis';
import {Functions} from 'circuit-models';
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

export function solveCircuit(circuit, circuitInfo) {
  try {
    const problem = hasPathProblem(circuit);
    if (problem) {
      throw problem;
    }
    const {solve, stamp: stamper} = Analyser.createEquationBuilder(circuitInfo);
    R.forEach(model => {
      stamp(model, stamper);
    }, R.values(circuit.models));
    const solution = solve();
    return {
      solution: R.flatten(solution()), // flatten single column matrix into array
      error: false
    };
  } catch(e) {
    // if we can't solve, there's probably something wrong with the circuit
    return {
      solution: blankSolution(circuitInfo),
      error: e
    };
  }
}
