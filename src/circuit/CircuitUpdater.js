import R from 'ramda';

import { GROUND_NODE } from '../Constants';
import { BaseData as Models } from './models';

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
function toConnectors(view) {
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
export function toNodes(views) {
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
  const toModel = (view) => {
    return R.mergeAll([
      Models[view.typeID],
      R.pick(['editables'], view),
      { id: view.id }
    ]);
  };
  return R.map(toModel, views);
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

export function setVoltSrcNums(models) {
  let vNum = 0;
  const assignVoltSrcNums = (model) => {
    if (model.numVoltSources && model.numVoltSources > 0) {
      let vSourceNums = [];
      for (let i = 0; i < model.numVoltSources; i++) {
        vSourceNums.push(vNum);
        vNum++;
      }
      return R.assoc('vSourceNums', vSourceNums, model);
    }
    return model;
  };
  return R.map(assignVoltSrcNums, models);
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
    const numOfVSources = model.numVoltSources || 0;
    const calculateCurrent = currentCalculators[model.id];
    if (numOfVSources > 0) {
      state.currents = [];
      model.vSourceNums.forEach((vNum) => state.currents.push(currents[vNum]));
    } else if (calculateCurrent) {
      // FIXME support components with voltage sources which need
      // current calculating?
      state.currents = calculateCurrent(vs);
    }

    return state;
  };

  return R.map(toState, circuitGraph.models);
}
