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
  const problem = hasPathProblem(circuit);
  if (problem) {
    return {
      solution: blankSolution(circuitInfo),
      error: problem
    };
  }
  try {
    const {solve, stamp: stamper} = Analyser.createEquationBuilder(circuitInfo);
    R.forEach(model => {
      stamp(model, stamper);
    }, R.values(circuit.models));
    const solution = solve();
    return {
      solution: R.flatten(solution())
    };
  } catch(e) {
    // if we can't solve, there's probably something wrong with the circuit
    return {
      solution: blankSolution(circuitInfo),
      error: e
    };
  }
}

export function updateCircuit(state, solution, circuitInfo) {
  if (!solution) { return state; }

  const flattened = R.prepend(0, solution); // add 0 volt ground node

  const voltages = R.take(circuitInfo.numOfNodes, flattened);
  let currents = R.drop(circuitInfo.numOfNodes, flattened);

  return state.update('views', views => views.map(view => {
    const viewID = view.getIn(['props', 'id']);
    const model = state.getIn(['models', viewID]);
    const nodeIDs = model.get('nodes');

    // set voltages
    const vs = nodeIDs.map(nodeID => voltages[nodeID]);
    view = view.setIn(['props', 'voltages'], vs.toJS());

    // set currents
    const numOfVSources = model.get('vSources', 0);
    if (numOfVSources > 0) {
      const cs = R.take(numOfVSources, currents);
      currents = R.drop(numOfVSources, currents);
      view = view.setIn(['props', 'currents'], cs);
    }

    return view;
  }));
}
