import R from 'ramda';

const val = e => ({
  isIn(array) {
    return array.indexOf(e) !== -1;
  }
});

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
      if (val(id).isIn(exclude)) {
        continue; // ignore paths through excluded models
      } else if (types && !val(models[id].type).isIn(types)) {
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
  return function(model) {
    return val(model.get('type')).isIn(types);
  };
}

function pathFinderFor(circuit) {
  const pathFinder = {};
  function hasPathThrough(types) {
    return function hasPath(model, id) {
      const [node1, node2] = model.toJS().nodes;
      return isPathBetween(node1, node2, circuit, {
        exclude: [id], // exclude the model we're looking at
        types
      });
    };
  }
  pathFinder.hasPathThrough = hasPathThrough;
  pathFinder.hasPath = hasPathThrough();
  return pathFinder;
}

export function hasPathProblem(state) {
  const VOLT_SOURCES = ['VoltageSource', 'Wire'], // TODO make this less ugh - don't use magic strings!
        CURR_SOURCE = ['CurrentSource'],

        models = state.get('models'),

        {hasPathThrough, hasPath} = pathFinderFor({
            nodes: state.get('nodes').toJS(),
            models: models.toJS()
          }),

        hasNoCurrentPath = () => {
          // look for current sources with no path for current
          return !models
            .filter(isType(CURR_SOURCE))
            .every(hasPath);
        },
        hasVoltageSourceLoop = () => {
          // look for loops of voltage sources
          return models
            .filter(isType(VOLT_SOURCES))
            .some(hasPathThrough(VOLT_SOURCES));
        },

        checks = [
          {
            run: hasNoCurrentPath,
            error: 'No path for current source.'
          },
          {
            run: hasVoltageSourceLoop,
            error: 'Voltage source loop.'
          }
        ],

        problem = R.find(check => check.run(), checks);

  return problem ? problem.error : false;
}
