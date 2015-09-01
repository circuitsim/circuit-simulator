import R from 'ramda';

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
      const connectors = nodes[n];

      for (let i = 0; i < connectors.length; i++) {
        const con = connectors[i];
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
  const VOLT_SOURCES = ['VoltageSource', 'Wire'], // FIXME make this less ugh - don't use magic strings!
        CURR_SOURCE = ['CurrentSource'],

        {hasPathThrough, hasPath} = pathFinderFor(circuit),

        // look for current sources with no path for current
        hasNoCurrentPath = R.pipe(
          R.filter(isType(CURR_SOURCE)),
          R.all(hasPath),
          R.not
        ),
        // look for loops of voltage sources
        hasVoltageSourceLoop = R.pipe(
          R.filter(isType(VOLT_SOURCES)),
          R.any(hasPathThrough(VOLT_SOURCES))
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
