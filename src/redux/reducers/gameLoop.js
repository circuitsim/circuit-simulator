import R from 'ramda';
import CircuitComponents from '../../ui/diagram/components/AllViews.js';
import { isPointIn } from '../../ui/diagram/boundingBox.js';
import { BaseData as Models } from '../../ui/diagram/components/models/AllModels.js';
import { getCircuitInfo, solveCircuit } from '../../update/Solver.js';
import { updateViews, setNodesInModels, toNodes } from '../../update/CircuitUpdater.js';
import {
  LOOP_BEGIN,
  LOOP_UPDATE
} from '../actions.js';

function setHover(state) {
  const views = state.views;
  const isMouseOver = view => {
    const { typeID, props: { connectors }} = view;
    const CircuitComp = CircuitComponents[typeID];
    if (state.addingComponent.id === view.props.id) {
      return false; // don't detect hovers over component being added
    }
    return isPointIn(state.mousePos, CircuitComp.getBoundingBox(connectors));
  };

  const pickBest = R.reduce((currentBest, viewID) => {
    return currentBest || viewID;
  }, state.hoveredViewID); // prefer currently hovered view

  const moreThanOne = R.pipe(
    R.length,
    R.gt(R.__, 1) // eslint-disable-line no-underscore-dangle
  );

  const hoveredViewID = R.pipe(
    R.filter(isMouseOver),
    R.map(view => view.props.id),
    R.ifElse(moreThanOne, pickBest, R.head)
  )(R.values(views));

  return R.assocPath(['hoveredViewID'], hoveredViewID, state);
}

export default function gameLoopReducers(state, action) {
  switch (action.type) {
  case LOOP_BEGIN: {
    let localState = state;
    const views = localState.views;

    localState = setHover(localState);

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
