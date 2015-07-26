import Analyser from 'circuit-analysis';
import {Functions} from 'circuit-models';
import R from 'ramda';

import {hasPathProblem} from './Paths.js';

const {stamp} = Functions;

export function getCircuitInfo(state) {
  return {
    numOfNodes: state.get('nodes').size,
    numOfVSources: state.get('models')
      .filter(m => m.has('vSources'))
      .reduce((n, m) => n + m.get('vSources'), 0)
  };
}

function blankSolution(circuitInfo) {
  // just return a blank solution (zeros for voltages/currents)
  const n = Math.max(0, circuitInfo.numOfNodes + circuitInfo.numOfVSources - 1);
  return Array.fill(new Array(n), 0);
}

export function solveCircuit(state, circuitInfo) {
  const problem = hasPathProblem(state);
  if (problem) {
    console.error('Path problem:', problem);
    return {
      solution: blankSolution(circuitInfo),
      error: problem
    };
  }
  try {
    const {solve, stamp: stamper} = Analyser.createEquationBuilder(circuitInfo);
    state.get('models').forEach(model => {
      stamp(model, stamper);
    });
    const solution = solve();
    return {
      solution: R.flatten(solution())
    };
  } catch(e) {
    // if we can't solve, there's probably something wrong with the circuit
    console.error(e);
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
