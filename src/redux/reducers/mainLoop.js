import R from 'ramda';

import setHover from './hover.js';
import { getCircuitInfo, solveCircuit } from './mainLoop/Solver.js';
import { updateViews, setNodesInModels, toNodes, toModels } from './mainLoop/CircuitUpdater.js';

import MODES from '../../Modes.js';
import {
  LOOP_BEGIN,
  LOOP_UPDATE
} from '../actions.js';

export default function mainLoopReducer(state, action) {
  switch (action.type) {
  case LOOP_BEGIN: {
    let localState = state;
    const { views, mode } = localState;

    localState = mode.type === MODES.move // only hover highlight in move mode
      ? setHover(localState)
      : state;

    if (localState.circuitChanged) {
      // create a graph of the circuit that we can use to analyse
      const nodes = toNodes(views);
      const models = setNodesInModels(toModels(views), nodes);
      const circuitGraph = {
        // models: {
        //   id: {
        //     typeID,
        //     nodes: [nodeIDs]
        //   }
        // }
        models,

        // nodes: [ // node ID is index in this array
        //   [ // array of views connected to this node
        //     {
        //       viewID, // maybe modelID would be better?
        //       index
        //     }
        //   ]
        // ]
        nodes,

        // numOfNodes
        // numOfVSources
        ...getCircuitInfo({models, nodes})
      };

      // solve the circuit
      const {solution, error} = solveCircuit(circuitGraph);
      if (error) { console.warn(error); } // eslint-disable-line no-console

      // update view with new circuitGraph state
      const updatedViews = updateViews(circuitGraph, solution, views);

      return R.pipe(
        R.assoc('views', updatedViews),
        R.assoc('circuitChanged', false),
        R.assoc('error', error || false)
      )(localState);
    }
    return localState;
  }

  case LOOP_UPDATE:
    return R.assoc('currentOffset', state.currentOffset += action.delta, state);

  default:
    return state;
  }
}
