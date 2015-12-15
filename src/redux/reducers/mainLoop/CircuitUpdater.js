import R from 'ramda';

import { GROUND_NODE } from '../../../Constants.js';
import { BaseData as Models } from '../../../ui/diagram/components/models';

function toConnectors(view) {
  // IN:
  // [{
  //   id
  //   connectors: [Vector]
  // }]

  // OUT:
  // [{
  //   pos: Vector
  //   id: {
  //     viewID
  //     index
  //   }
  // }]
  const {connectors} = view;
  return R.addIndex(R.map)((vector, index) => ({
    pos: vector,
    id: {
      viewID: view.id,
      index: index
    }
  }), connectors);
}

function merge(connectors) {
  return R.reduce((nodeIDs, connector) => {
    return R.append(connector.id, nodeIDs);
  }, [], connectors);
}

function position(connector) { return connector.pos.toString(); }

export function toNodes(views) {
  // IN:
  // views: {
  //   id: {
  //     typeID: string,
  //     id,
  //     connectors: [Vector]
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
  return R.map(view => R.merge(Models[view.typeID], R.pick(['value'], view)), views);
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

export function getCircuitState(circuitGraph, solution, componentIDs) {
  if (!solution) { return {}; }

  const voltages = R.take(circuitGraph.numOfNodes, solution);
  let currents = R.drop(circuitGraph.numOfNodes, solution);

  const toState = componentID => {
    const state = {};
    const model = circuitGraph.models[componentID];
    const nodeIDs = model.nodes;

    // set voltages
    const vs = R.map(nodeID => voltages[nodeID], nodeIDs);
    state.voltages = vs;

    // set currents
    const numOfVSources = model.vSources || 0;
    if (numOfVSources > 0) {
      const cs = R.take(numOfVSources, currents);
      currents = R.drop(numOfVSources, currents);
      state.currents = cs;
    }

    return state;
  };

  return R.pipe(
    R.map(toState),
    R.zipObj(componentIDs)
  )(componentIDs);
}
