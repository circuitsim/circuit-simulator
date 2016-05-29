import { toNodes, toModels, setNodesInModels, setVoltSrcNums, getCircuitState } from '../CircuitUpdater.js';
import {BASIC_CIRCUIT} from './CircuitData.js';

describe('toNodes()', () => {
  it('should return the correct list of nodes for a given list of views', () => {
    expect(toNodes(BASIC_CIRCUIT.views)).to.deep.equal(BASIC_CIRCUIT.nodes);
  });
});

describe('toModels()', () => {
  it('should should turn views into models', () => {
    const models = toModels(BASIC_CIRCUIT.views);
    expect(models).to.deep.equal(BASIC_CIRCUIT.modelsNoNodes);
  });
});

describe('setNodesInModels()', () => {
  it('should return the models with the nodes they\'re connected to', () => {
    const nodes = toNodes(BASIC_CIRCUIT.views);
    const models = setVoltSrcNums(setNodesInModels(BASIC_CIRCUIT.modelsNoNodes, nodes));
    expect(models).to.deep.equal(BASIC_CIRCUIT.models);
  });
});

describe('getCircuitState()', () => {
  it('should update views with new currents and voltages from solution', () => {
    const nodes = toNodes(BASIC_CIRCUIT.views);
    const models = setVoltSrcNums(setNodesInModels(BASIC_CIRCUIT.models, nodes));

    // solve the circuit
    const circuitMeta = { numOfNodes: 5, numOfVSources: 3 };
    const solution = [ 0, 5, 5, 0, 0, 0.5, 0.5 ]; // 0V, 5V, 5V, 0V, 0A, 0.5A, 0.5A
    const fullSolution = [0, ...solution]; // add 0 volt ground node
    const circuitGraph = {
      nodes,
      models,
      ...circuitMeta
    };

    // update view with new circuit state
    const circuitState = getCircuitState(circuitGraph, fullSolution);
    expect(circuitState).to.deep.equal(BASIC_CIRCUIT.analysisResult);
  });
});
