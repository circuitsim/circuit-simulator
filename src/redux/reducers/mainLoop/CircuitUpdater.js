import R from 'ramda';

import { GROUND_NODE } from '../../../Constants.js';
import { BaseData as Models } from '../../../ui/diagram/components/models/AllModels.js';

function toConnectors(view) {
  // IN:
  // props: {
  //   id
  //   connectors: [Vector]
  // }

  // OUT:
  // [{
  //   pos: Vector
  //   id: {
  //     viewID
  //     index
  //   }
  // }]
  const props = view.props;
  return R.addIndex(R.map)((vector, index) => ({
    pos: vector,
    id: {
      viewID: props.id,
      index: index
    }
  }), props.connectors);
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
  //     props: {
  //       id,
  //       connectors: [Vector]
  //     }
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
      viewID: v.props.id,
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
  return R.mapObj(view => Models[view.typeID], views);
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

export function updateViews(circuitGraph, solution, views) {
  if (!solution) { return views; }

  const flattened = R.prepend(0, solution); // add 0 volt ground node

  const voltages = R.take(circuitGraph.numOfNodes, flattened);
  let currents = R.drop(circuitGraph.numOfNodes, flattened);

  return R.mapObj(view => {
    const viewID = view.props.id;
    const model = circuitGraph.models[viewID];
    const nodeIDs = model.nodes;

    // set voltages
    const vs = R.map(nodeID => voltages[nodeID], nodeIDs);
    view = R.assocPath(['props', 'voltages'], vs, view);

    // set currents
    const numOfVSources = model.vSources || 0;
    if (numOfVSources > 0) {
      const cs = R.take(numOfVSources, currents);
      currents = R.drop(numOfVSources, currents);
      view = R.assocPath(['props', 'currents'], cs, view);
    }

    return view;
  }, views);
}
