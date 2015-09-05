import R from 'ramda';

import addingComponentsReducer from './reducers/addingComponents.js';
import modesReducer from './reducers/modes.js';

import { getCircuitInfo, solveCircuit } from '../update/Solver.js';
import { updateViews, setNodesInModels, toNodes } from '../update/CircuitUpdater.js';
import MODES from '../Modes.js';

import {
  MODE_ADD,
  MODE_ADDING,
  MODE_SELECT,
  CHANGE_MODE_BUTTON_CLICK,

  ADDING_START,
  ADDING_MOVE,
  ADDING_FINISH,

  COMPONENT_MOUSE_OVER,
  COMPONENT_MOUSE_OUT,

  LOOP_BEGIN,
  LOOP_UPDATE,

  SELECT_BUTTON
} from './actions.js';

export const initialState = {
  mode: {
    type: MODES.select
  },

  addingComponent: {},

  currentOffset: 0,

  // views: {
  //   id: {
  //     ReactComponent,
  //     props: {
  //       id,
  //       connectors: [Vector]
  //     }
  //   }
  // }
  views: {},

  // models: {
  //   id: {
  //     typeID,
  //     nodes: [nodeIDs]
  //   }
  // }
  models: {},

  // nodes: [ // node ID is index in this array
  //   [ // array of views connected to this node
  //     {
  //       viewID, // maybe modelID would be better?
  //       index
  //     }
  //   ]
  // ]
  nodes: [],

  circuitChanged: false,
  error: false, // string | false

  selectedButton: 'select'
};

export default function simulatorReducer(state = initialState, action) {
  switch (action.type) {

  case MODE_ADD:
  case MODE_ADDING:
  case MODE_SELECT:
  case CHANGE_MODE_BUTTON_CLICK:
    return modesReducer(state, action);

  case ADDING_START:
  case ADDING_MOVE:
  case ADDING_FINISH:
    return addingComponentsReducer(state, action);


  case COMPONENT_MOUSE_OVER:
    return R.assocPath(['views', action.id, 'props', 'hover'], true, state);

  case COMPONENT_MOUSE_OUT:
    return R.assocPath(['views', action.id, 'props', 'hover'], false, state);


  case LOOP_BEGIN:
    if (state.circuitChanged) {
      // create a graph of the circuit that we can use to analyse
      const nodes = toNodes(state.views);
      const models = setNodesInModels(state.models, nodes);

      // solve the circuit
      const circuit = {
        nodes,
        models
      };
      const circuitInfo = getCircuitInfo(circuit);
      const {solution, error} = solveCircuit(circuit, circuitInfo);

      // update view with new circuit state
      const views = updateViews(models, circuitInfo, state.views, solution);

      if (error) { console.warn(error); } // eslint-disable-line no-console

      return R.pipe(
        R.assoc('views', views),
        R.assoc('models', models),
        R.assoc('nodes', nodes),
        R.assoc('circuitChanged', false),
        R.assoc('error', error || false)
      )(state);
    }
    return state;

  case LOOP_UPDATE:
    return R.assoc('currentOffset', state.currentOffset += action.delta, state);


  case SELECT_BUTTON:
    return R.assoc('selectedButton', action.buttonID, state);

  default:
    return state;
  }
}
