import R from 'ramda';

import {
  getCircuitInfo,
  checkForProblems,
  stampStaticEquation,
  // stampDynamicEquation,
  solveEquation
} from './mainLoop/Solver.js';
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
  circuitGraph: {

    // models: {
    //   id: {
    //     typeID,
    //     nodes: [nodeIDs]
    //   }
    // }
    models: {},

    // nodes: [ // node ID is index in this array
    //   [ // array of models connected to this node
    //     {
    //       viewID, // maybe modelID would be better?
    //       index
    //     }
    //   ]
    // ]
    nodes: [],

    numOfNodes: 0,
    numOfVSources: 0
  },

  // previousCircuitState
  // {
  //  id: {
  //    voltages: []
  //    currents: []
  //  }
  // }
  components: {},

  staticEquation: null,

  currentOffset: 0,

  // TODO maxVoltage: 5,
  volts2RGB: createVolts2RGB(5),

  circuitChanged: false,
  error: false // string | false
};


// const CIRCUIT_TIMESTEP = 5e-6;

export default function mainLoopReducer(circuit = INITIAL_STATE, action) {
  switch (action.type) {
  case LOOP_BEGIN: {
    const { views } = action;

    if (circuit.circuitChanged) {
      // create a graph of the circuit that we can use to analyse
      const nodes = toNodes(views);
      const models = setNodesInModels(toModels(views), nodes);
      const circuitGraph = {
        models,
        nodes,
        ...getCircuitInfo({models, nodes})
      };

      const error = checkForProblems(circuitGraph);
      if (error) { console.warn(error); } // eslint-disable-line no-console

      let staticEquation = null;
      if (!error) {
        staticEquation = stampStaticEquation(circuitGraph);
      }

      return {
        ...circuit,
        circuitGraph,
        staticEquation,
        circuitChanged: false,
        error
      };
    }
    return circuit;
  }

  case LOOP_UPDATE: {
    if (!circuit.staticEquation) {
      return circuit;
    }
    // TODO Decouple real timestep (delta) from stuff like:
    // - simulation timestep (time simulated per analysis)
    // - simuation speed (time simulated per frame (or update))
    // - current speed
    //
    // Simulation timestep defaults to 5μs and should rarely need to be changed
    //  (except possibly in response to stablity issues)
    // Time to be simulated per frame should be user-controllable to view high- or low-frequency circuits
    // Current timestep should be user-controllable to view high- or low-current circuits


    // TODO loop until we have simulated adjusted delta time at 5μs per analysis
    // where adjusted delta time defines the simulation speed

    // TODO previousCircuitState won't have any info on a newly added component

    // const { delta } = action;
    const { staticEquation, circuitGraph /*components: previousCircuitState*/ } = circuit;

    // const fullEquation = stampDynamicEquation(circuit, staticEquation, delta, previousCircuitState); // FIXME mutates equation

    // solve the circuit
    const {solution, error} = solveEquation(staticEquation);
    if (error) { console.warn(error); } // eslint-disable-line no-console

    const fullSolution = [0, ...solution]; // add 0 volt ground node

    // update view with new circuitGraph state
    const modelIDs = R.keys(circuitGraph.models);
    const circuitState = getCircuitState(circuitGraph, fullSolution, modelIDs);

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
      error,
      components: circuitState,
      currentOffset: circuit.currentOffset += action.delta
    };
  }

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
