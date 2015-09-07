import R from 'ramda';

import { BaseData as Models } from '../ui/diagram/components/models/AllModels.js';

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

  SELECT_BUTTON,

  MOUSE_MOVED
} from './actions.js';

export const initialState = {
  mode: {
    type: MODES.select
  },

  mousePos: {},

  addingComponent: {},

  currentOffset: 0,

  // views: {
  //   id: {
  //     typeID,
  //     props: {
  //       id,
  //       connectors: [Vector]
  //     }
  //   }
  // }
  views: {},

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
    // TODO check if mouse is over a circuit component 
    if (state.circuitChanged) {
      // create a graph of the circuit that we can use to analyse
      let preViews = state.views;
      const nodes = toNodes(preViews);
      const preModels = R.mapObj(view => Models[view.typeID], preViews);
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
      const views = updateViews(models, circuitInfo, preViews, solution);

      if (error) { console.warn(error); } // eslint-disable-line no-console

      return R.pipe(
        R.assoc('views', views),
        R.assoc('circuitChanged', false),
        R.assoc('error', error || false)
      )(state);
    }
    return state;

  case LOOP_UPDATE:
    return R.assoc('currentOffset', state.currentOffset += action.delta, state);


  case SELECT_BUTTON:
    return R.assoc('selectedButton', action.buttonID, state);

  case MOUSE_MOVED:
    return R.assoc('mousePos', action.coords, state);

  default:
    return state;
  }
}
