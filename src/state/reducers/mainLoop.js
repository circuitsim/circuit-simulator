import R from 'ramda';

import {
  getCircuitInfo,
  checkForProblems,
  stampStaticEquation,
  stampDynamicEquation,
  solveEquation,
  blankSolutionForCircuit
} from '../../circuit/Solver';
import {
  getCircuitState,
  setNodesInModels,
  setVoltSrcNums,
  toNodes,
  toModels
} from '../../circuit/CircuitUpdater';
import { clone } from '../../circuit/equation';
import { connectDisconnectedCircuits } from '../../circuit/Paths';
import { createVolts2RGB } from '../../utils/volts2RGB.js';

import {
  LOOP_BEGIN,
  LOOP_UPDATE,
  EDIT_COMPONENT,
  DELETE_COMPONENT,
  ADDING_MOVED,
  MOVING_MOVED,
  LOAD_CIRCUIT
} from '../actions';

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

  ...createVolts2RGB(1, 1),

  circuitChanged: false,
  error: false, // string | false

  remainingDelta: 0,
  simTime: 0,

  timestep: 5e-6,
  simTimePerSec: 1 / 1000 // Run the simulation 1000x slower than reality
};

const zeroed = (circuit, error) => {
  const { circuitGraph } = circuit;
  const solution = blankSolutionForCircuit(circuitGraph);
  const blankCircuitState = getCircuitState(circuitGraph, solution);

  return {
    ...circuit,
    components: blankCircuitState,
    remainingDelta: 0,
    error: error || circuit.error
  };
};

// Decouple real timestep (delta) from stuff like:
// - simulation timestep (time simulated per analysis)
// - simuation speed (time simulated per frame (or update))
// - current speed
//
// Simulation timestep defaults to 5μs and should rarely need to be changed
//  (except possibly in response to stablity issues)
// Time to be simulated per second should be user-controllable to view high- or low-frequency circuits
// Current timestep should be user-controllable to view high- or low-current circuits

export default function mainLoopReducer(circuit = INITIAL_STATE, action) {
  switch (action.type) {
  case LOOP_BEGIN: {
    const { views } = action;

    if (R.isEmpty(views)) {
      return {
        ...circuit,
        circuitGraph: INITIAL_STATE.circuitGraph,
        staticEquation: INITIAL_STATE.staticEquation,
        circuitChanged: false,
        error: 'No circuit'
      };
    }

    if (circuit.circuitChanged) {
      // create a graph of the circuit that we can use to analyse
      const nodes = toNodes(views);
      const models = setVoltSrcNums(setNodesInModels(toModels(views), nodes));
      const circuitMeta = getCircuitInfo({models, nodes});
      const circuitGraph = {
        models,
        nodes,
        ...circuitMeta
      };

      const error = checkForProblems(circuitGraph);
      if (error) { console.warn(error); } // eslint-disable-line no-console

      let staticEquation = null;
      if (!error) {
        staticEquation = stampStaticEquation(circuitGraph);
        connectDisconnectedCircuits(circuitGraph, staticEquation);
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
    if (circuit.error) {
      return zeroed(circuit);
    }

    const {
      staticEquation,
      circuitGraph,
      components: previousCircuitState,

      simTime,
      remainingDelta, // seconds
      timestep, // seconds
      simTimePerSec,

      voltageRange: prevVoltageRange
    } = circuit;

    let {
      delta // milliseconds
    } = action;

    delta /= 1000; // convert from milliseconds to seconds

    /* eslint-disable indent */ // SIGH need to deal with this shit
    let fullSolution = [],
        currentCalculators = {},
        circuitState = previousCircuitState,
        timeToSimulate = (delta * simTimePerSec) + remainingDelta,
        timeLeft = timeToSimulate;
    /* eslint-enable indent */

    if (timeToSimulate < timestep) {
      return { ...circuit, remainingDelta: timeToSimulate };
    }

    try {
      for (
        ;
        timeLeft >= timestep;
        timeLeft -= timestep
      ) {
        const fullEquation = clone(staticEquation);
        currentCalculators = stampDynamicEquation(
          circuitGraph,
          fullEquation, // this gets mutated!
          timestep,
          simTime,
          circuitState
        );

        const solution = solveEquation(fullEquation);
        fullSolution = [0, ...solution]; // add 0 volt ground node

        circuitState = getCircuitState(circuitGraph, fullSolution, currentCalculators);
      }
    } catch (e) {
      console.warn(e); // eslint-disable-line no-console
      console.warn(e.stack); // eslint-disable-line no-console
      return zeroed(circuit, e);
    }

    // TODO factor this out
    const voltages = R.take(circuitGraph.numOfNodes, fullSolution);
    const maxVoltage = R.pipe(
      R.map(Math.abs),
      R.reduce(R.max, 0),
    )(voltages);
    const {
      voltageRange,
      volts2RGB
    } = createVolts2RGB(maxVoltage, prevVoltageRange);

    return {
      ...circuit,
      error: false,
      components: circuitState,
      remainingDelta: timeLeft,
      simTime: simTime + timeToSimulate - timeLeft,

      volts2RGB,
      voltageRange
    };
  }

  case EDIT_COMPONENT:
  case DELETE_COMPONENT:
  case ADDING_MOVED:
  case MOVING_MOVED:
  case LOAD_CIRCUIT:
    return {
      ...circuit,
      circuitChanged: true
    };

  default:
    return circuit;
  }
}
