
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
 * @param nodes - Nodes in the graph.
 * @param models - Edges of the graph.
 * @param opts - Extra options.
 * @param opts.exclude - Don't look for paths through models with these IDs.
 * @param opts.types - If defined, only look for paths through these types.
 */
function isPathBetween(
    startNode, destNode,
    nodes, models,
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

export function hasPathProblem(state) {
  const VOLT_SOURCES = ['VoltageSource', 'Wire'], // TODO make this less ugh - don't use magic strings!
        CURR_SOURCE = ['CurrentSource'],
        models = state.get('models'),
        isType = types => model => {
          return val(model.get('type')).isIn(types);
        },
        hasPathThrough = types => (component, id) => {
          const nodes = state.get('nodes').toJS(),
                modelsJS = models.toJS(),
                [node1, node2] = modelsJS[id].nodes;
          return isPathBetween(node1, node2, nodes, modelsJS, {
            exclude: [id], // exclude the component we're looking at
            types
          });
        },
        hasPath = hasPathThrough();
  return (
    // look for current sources with no path for current
    !models
      .filter(isType(CURR_SOURCE))
      .every(hasPath)
    ||
    // look for loops of voltage sources
    models
      .filter(isType(VOLT_SOURCES))
      .some(hasPathThrough(VOLT_SOURCES))
  );
}
