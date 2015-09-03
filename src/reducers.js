import uuid from 'node-uuid';
import Vector from 'immutable-vector2d';
import R from 'ramda';
import { Elements, handleHover } from 'circuit-diagram';

import { getCircuitInfo, solveCircuit } from './update/Solver.js';
import { updateViews, setNodesInModels, toNodes } from './update/CircuitUpdater.js';

import {
  CANVAS_MOUSE_DOWN,
  CANVAS_MOUSE_MOVE,
  CANVAS_MOUSE_UP,

  COMPONENT_MOUSE_OVER,
  COMPONENT_MOUSE_OUT,

  LOOP_BEGIN,
  LOOP_UPDATE,

  COMPONENT_SELECTOR_BUTTON_CLICKED
} from './actions.js';

const modeNames = [
  'add',
  'adding',
  'select' // does nothing ATM
];
const MODES = R.zipObj(modeNames, modeNames);

const initialState = {
  mode: {
    type: MODES.select
  },
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

  // nodes: [
  //   [ // array of views connected to this node
  //     {
  //       viewID,
  //       index
  //     }
  //   ]
  // ]
  nodes: [],

  circuitChanged: false,
  error: false, // string | false

  selectedButton: 'select'
};

const getConnectorPositions = function(component, startPoint, dragPoint) {
  return component.getConnectorPositions && component.getConnectorPositions(startPoint, dragPoint);
};

export default function simulator(state = initialState, action) {
  switch (action.type) {
  case CANVAS_MOUSE_DOWN:
    if (state.mode.type === MODES.add) {
      return R.assoc('mode', {
        type: MODES.adding,
        componentType: state.mode.componentType,
        id: uuid.v4(),
        start: action.coords
      }, state);
    }
    return state;

  case CANVAS_MOUSE_MOVE:
    if (state.mode.type === MODES.adding) {
      const startPoint = Vector.fromObject(state.mode.start),
            dragPoint = Vector.fromObject(action.coords),
            id = state.mode.id,
            type = state.mode.componentType,
            connectors = getConnectorPositions(type, startPoint, dragPoint);
      if (connectors.length === 0) {
        return state; // couldn't get connector positions, maybe too small
      }

      return R.pipe(
        R.assoc('circuitChanged', true),
        R.assocPath(['models', id], type.model),
        R.assocPath(['views', id], {
          component: type,
          props: {
            id,
            connectors
          }
        })
      )(state);
    }
    return state;

  case CANVAS_MOUSE_UP: // FIXME horrible logic
    if (state.mode.type === MODES.adding) {
      const id = state.mode.id,
            componentType = state.mode.componentType,
            stateWithNextMode = R.assoc('mode', {
              type: MODES.add,
              componentType
            }, state),
            newView = state.views[id];

      if (newView) {
        return R.pipe(
          R.assoc('circuitChanged', true),
          R.assocPath(['views', id, 'component'], handleHover(newView.component))
        )(stateWithNextMode);
      } else {
        return stateWithNextMode;
      }
    }
    return state;


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


  case COMPONENT_SELECTOR_BUTTON_CLICKED:
    const buttonID = action.buttonID;
    const updatedState = R.assoc('selectedButton', buttonID, state);

    const buttonIdToModeMap = {
      select: {
        type: MODES.select
      }
    };
    const element = Elements[buttonID];
    const mode = element
      ? {
        type: MODES.add,
        componentType: element
      }
      : buttonIdToModeMap[buttonID];

    return R.assoc('mode', mode, updatedState);

  default:
    return state;
  }
}
