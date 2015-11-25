import R from 'ramda';

import { getCircuitInfo, solveCircuit } from './mainLoop/Solver.js';
import { getCircuitState, setNodesInModels, toNodes, toModels } from './mainLoop/CircuitUpdater.js';
import { createVolts2RGB } from '../../utils/volts2RGB.js';

import {
  LOOP_BEGIN,
  LOOP_UPDATE,
  CHANGE_COMPONENT_VALUE,
  DELETE_COMPONENT,
  ADDING_MOVED,
  MOVING_MOVED
} from '../actions.js';

const INITIAL_STATE = {
  components: {},

  currentOffset: 0,

  // TODO maxVoltage: 5,
  volts2RGB: createVolts2RGB(5),

  circuitChanged: false,
  error: false // string | false
};

export default function mainLoopReducer(circuit = INITIAL_STATE, action) {
  switch (action.type) {
  case LOOP_BEGIN: {
    const { views } = action;

    if (circuit.circuitChanged) {
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

      const fullSolution = [0, ...solution]; // add 0 volt ground node

      // update view with new circuitGraph state
      const circuitState = getCircuitState(circuitGraph, fullSolution, R.keys(views));

      // TODO factor this out
      const voltages = R.take(circuitGraph.numOfNodes, fullSolution);
      const maxVoltage = R.pipe(
        R.map(Math.abs),
        R.reduce(R.max, 0)
      )(voltages);
      const volts2RGB = createVolts2RGB(maxVoltage);

      return {
        ...circuit,
        volts2RGB,
        components: circuitState,
        error: error || false,
        circuitChanged: false
      };
    }
    return circuit;
  }

  case LOOP_UPDATE:
    return R.assoc('currentOffset', circuit.currentOffset += action.delta, circuit);

  case CHANGE_COMPONENT_VALUE:
  case DELETE_COMPONENT:
  case ADDING_MOVED:
  case MOVING_MOVED:
    return {
      ...circuit,
      circuitChanged: true
    };

  default:
    return circuit;
  }
}
