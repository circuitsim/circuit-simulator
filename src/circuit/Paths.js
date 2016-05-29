import R from 'ramda';

import { GROUND_NODE } from '../Constants.js';
import { BaseData as Models } from './models';
import { stampResistor } from './equation';

const VOLT_SOURCE_TYPES = R.pipe(
  R.values,
  R.filter(m => m.numVoltSources > 0),
  R.map(m => m.typeID)
)(Models);
const CURR_SOURCE_TYPES = [Models.CurrentSource.typeID];

/**
 * Use BFS to find a path between two nodes in the circuit graph.
 *
 * @param startNode - Node to begin searching from.
 * @param destNode - Node to find path to.
 * @param circuit
 * @param circuit.nodes - Nodes in the graph.
 * @param circuit.models - Edges of the graph.
 * @param opts - Extra options.
 * @param opts.exclude - Don't look for paths through models with these IDs.
 * @param opts.types - If defined, only look for paths through these types.
 */
function isPathBetween(
  startNode, destNode,
  {nodes, models},
  {exclude, types} = {
    exclude: [],
    types: null
  }) {

  const visited = [],
        q = [];

  visited[startNode] = true;
  q.push(startNode);

  if (startNode === destNode) { return true; }

  while (q.length !== 0) {
    const n = q.shift();
    const tConnectors = nodes[n];

    for (let i = 0; i < tConnectors.length; i++) {
      const con = tConnectors[i];
      const id = con.viewID;

      if (R.contains(id, exclude)) {
        continue; // ignore paths through excluded models
      } else if (types && !R.contains(models[id].typeID, types)) {
        continue; // ignore paths that aren't through the given types
      }
      const connectedNodes = models[id].nodes;
      for (let j = 0; j < connectedNodes.length; j++) {
        const connectedNode = connectedNodes[j];
        if (connectedNode === destNode) {
          return true;
        }

        if (!visited[connectedNode]) {
          visited[connectedNode] = true;
          q.push(connectedNode);
        }
      }
    }
  }
  return false;
}

function isType(types) {
  return function([model]) {
    return R.contains(model.typeID, types);
  };
}

function pathFinderFor(circuit) {
  function hasPathThrough(types) {
    return function hasPath([model, id]) {
      const [node1, node2] = model.nodes;
      return isPathBetween(node1, node2, circuit, {
        exclude: [id], // exclude the model we're looking at
        types
      });
    };
  }
  const pathFinder = {};
  pathFinder.hasPathThrough = hasPathThrough;
  pathFinder.hasPath = hasPathThrough();
  return pathFinder;
}

function toReversePairs(obj) {
  return R.pipe(
    R.keys,
    R.map(k => [obj[k], k])
  )(obj);
}

export function hasPathProblem(circuit) {
  const {hasPathThrough, hasPath} = pathFinderFor(circuit),

        // look for current sources with no path for current
        hasNoCurrentPath = R.pipe(
          R.filter(isType(CURR_SOURCE_TYPES)),
          R.all(hasPath),
          R.not
        ),
        // look for loops of voltage sources
        hasVoltageSourceLoop = R.pipe(
          R.filter(isType(VOLT_SOURCE_TYPES)),
          R.any(hasPathThrough(VOLT_SOURCE_TYPES))
        ),

        checks = [{
          run: hasNoCurrentPath,
          error: 'No path for current source.'
        }, {
          run: hasVoltageSourceLoop,
          error: 'Voltage source loop.'
        }],

        modelIDPairs = toReversePairs(circuit.models),
        problem = R.find(check => check.run(modelIDPairs), checks);

  return problem ? problem.error : false;
}
// Use BFS to find all nodes connected to the given nodeID.
function findConnectedNodes({nodes, models, numOfNodes}, nodeID) {
  const connected = R.repeat(false, numOfNodes),
        q = [nodeID];

  while (q.length !== 0) {
    const currNodeID = q.shift(),
          tConnectors = nodes[currNodeID];

    for (let i = 0; i < tConnectors.length; i++) {
      const modelID = tConnectors[i].viewID,
            connectedNodes = models[modelID].nodes;

      for (let j = 0; j < connectedNodes.length; j++) {
        const connectedNode = connectedNodes[j];
        if (!connected[connectedNode]) {
          connected[connectedNode] = true;
          q.push(connectedNode);
        }
      }
    }
  }
  return connected;
}

const HIGH_RESISTANCE = 10e9;

// connect any disconnected circuits to ground using a high-value resistance
export function connectDisconnectedCircuits(circuit, equation) {
  let connectedNodes = R.repeat(false, circuit.numOfNodes);
  connectedNodes[GROUND_NODE] = true;

  for (let nodeID = 0; nodeID < connectedNodes.length; nodeID++) {
    if (connectedNodes[nodeID]) {
      continue;
    }

    const nodesConnectedToNodeID = findConnectedNodes(circuit, nodeID);
    stampResistor(equation)(HIGH_RESISTANCE, nodeID, GROUND_NODE);

    connectedNodes = R.zipWith((n1, n2) => {
      return n1 || n2;
    }, connectedNodes, nodesConnectedToNodeID);
  }
}
