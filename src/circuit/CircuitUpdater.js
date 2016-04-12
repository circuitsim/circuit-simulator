import R from 'ramda';

import { GROUND_NODE } from '../Constants';
import { BaseData as Models } from './models';

function toConnectors(view) {
  // IN:
  // [{
  //   id
  //   realConnectors: [Vector]
  // }]

  // OUT:
  // [{
  //   pos: Vector
  //   id: {
  //     viewID
  //     index
  //   }
  // }]
  const {realConnectors} = view;
  return R.addIndex(R.map)((vector, index) => ({
    pos: vector,
    id: {
      viewID: view.id,
      index: index
    }
  }), realConnectors);
}

function merge(realConnectors) {
  return R.reduce((nodeIDs, connector) => {
    return R.append(connector.id, nodeIDs);
  }, [], realConnectors);
}

function position(connector) { return connector.pos.toString(); }

export function toNodes(views) {
  // IN:
  // views: {
  //   id: {
  //     typeID: string,
  //     id,
  //     realConnectors: [Vector]
  //   }
  // }

  // OUT:
  // nodes: [
  //   [{
  //     viewID
  //     index
  //   }]
  // ]

  const groundIDs = R.pipe(
    R.values,
    R.filter(v => v.typeID === Models.Ground.typeID),
    R.map(v => ({
      viewID: v.id,
      index: 1 // implicit second connector connected to GROUND_NODE
    }))
  )(views);

  return R.pipe(
    R.values,
    R.chain(toConnectors), // chain === flatMap
    R.groupBy(position),
    R.values,
    R.map(merge),
    R.insert(GROUND_NODE, groundIDs)
  )(views);
}

export function toModels(views) {
  return R.map(view => R.mergeAll([Models[view.typeID], R.pick(['options'], view), {id: view.id}]), views);
}

export function setNodesInModels(models, nodes) {
  const forEachIndexed = R.addIndex(R.forEach);
  let ms = models;
  forEachIndexed((node, nodeID) => {
    R.forEach(connector => {
      // TODO find better way to modify array
      // R.update doesn't seem to like updating empty arrays
      const nodesForModel = R.clone(ms[connector.viewID].nodes);
      nodesForModel[connector.index] = nodeID;
      ms = R.assocPath([connector.viewID, 'nodes'], nodesForModel, ms);
    }, node);
  }, nodes);
  return ms;
}

// TODO document
// FIXME test currentCalculators
export function getCircuitState(circuitGraph, solution, currentCalculators = {}) {
  if (!solution) { return {}; }

  const voltages = R.take(circuitGraph.numOfNodes, solution);
  let currents = R.drop(circuitGraph.numOfNodes, solution);

  const toState = model => {
    const state = {
      // currents
      // voltages
    };
    const nodeIDs = model.nodes;

    // set voltages
    const vs = R.map(nodeID => voltages[nodeID], nodeIDs);
    state.voltages = vs;

    // set currents
    const numOfVSources = model.vSources || 0;
    const calculateCurrent = currentCalculators[model.id];
    if (numOfVSources > 0) {
      // Equivalent:
      // const cs = R.take(numOfVSources, currents);
      // currents = R.drop(numOfVSources, currents);
      const cs = currents.splice(0, numOfVSources);
      state.currents = cs;
    } else if (calculateCurrent) {
      // FIXME support components with voltage sources which need
      // current calculating?
      state.currents = calculateCurrent(vs);
    }

    return state;
  };

  return R.map(toState, circuitGraph.models);
}
