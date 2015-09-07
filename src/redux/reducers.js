import R from 'ramda';

import CircuitComponents from '../ui/diagram/components/AllViews.js';
import { BaseData as Models } from '../ui/diagram/components/models/AllModels.js';
import { isPointIn } from '../ui/diagram/boundingBox.js';

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
  hoveredViewID: null,

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


  case LOOP_BEGIN: {
    let localState = state;
    const views = localState.views;

    const isMouseOver = view => {
      const { typeID, props: { connectors }} = view;
      const CircuitComp = CircuitComponents[typeID];
      if (localState.addingComponent.id === view.props.id) {
        return false; // don't detect hovers over component being added
      }
      return isPointIn(localState.mousePos, CircuitComp.getBoundingBox(connectors));
    };

    const hoveredViewID = R.pipe(
      R.filter(isMouseOver),
      R.map(view => view.props.id),
      R.head // TODO better strategy for choosing
    )(R.values(views));

    localState = R.assocPath(['hoveredViewID'], hoveredViewID, localState);

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


  case SELECT_BUTTON:
    return R.assoc('selectedButton', action.buttonID, state);

  case MOUSE_MOVED:
    return R.assoc('mousePos', action.coords, state);

  default:
    return state;
  }
}
