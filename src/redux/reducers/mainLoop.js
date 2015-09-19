import R from 'ramda';

import { BaseData as Models } from '../../ui/diagram/components/models/AllModels.js';

import setHover from './hover.js';
import { getCircuitInfo, solveCircuit } from './mainLoop/Solver.js';
import { updateViews, setNodesInModels, toNodes } from './mainLoop/CircuitUpdater.js';

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
      const preModels = R.mapObj(view => Models[view.typeID], views);
      const models = setNodesInModels(preModels, nodes);

      // solve the circuit
      const circuit = {
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
        nodes
      };
      const circuitInfo = getCircuitInfo(circuit);
      const {solution, error} = solveCircuit(circuit, circuitInfo);

      // update view with new circuit state
      const updatedViews = updateViews(models, circuitInfo, views, solution);

      if (error) { console.warn(error); } // eslint-disable-line no-console

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
