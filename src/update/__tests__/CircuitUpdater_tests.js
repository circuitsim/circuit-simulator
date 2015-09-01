import { toNodes, setNodesInModels, updateViews } from '../CircuitUpdater.js';
import {BASIC_CIRCUIT} from './CircuitData.js';

describe('toNodes()', () => {
  it('should return the correct list of nodes for a given list of views', () => {
    expect(toNodes(BASIC_CIRCUIT.views)).to.deep.equal(BASIC_CIRCUIT.nodes);
  });
});

describe('setNodesInModels()', () => {
  it('should return the models with the nodes they\'re connected to', () => {
    const nodes = toNodes(BASIC_CIRCUIT.views);
    const models = setNodesInModels(BASIC_CIRCUIT.modelsNoNodes, nodes);
    expect(models).to.deep.equal(BASIC_CIRCUIT.models);
  });
});

describe('updateViews()', () => {
  it('should ', () => {
    const nodes = toNodes(BASIC_CIRCUIT.views);
    const models = setNodesInModels(BASIC_CIRCUIT.models, nodes);

    // solve the circuit
    const circuitInfo = { numOfNodes: 4, numOfVSources: 2 };
    const solution = [ 5, 5, 0, 0.5, 0.5 ];

    // update view with new circuit state
    const views = updateViews(models, circuitInfo, BASIC_CIRCUIT.views, solution);
    expect(views).to.deep.equal(BASIC_CIRCUIT.viewsSolution);
  });
});
