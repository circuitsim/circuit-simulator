import {getCircuitInfo, solveCircuit} from '../Solver.js';
import {BASIC_CIRCUIT} from './CircuitData.js';

describe('getCircuitInfo()', () => {
  it('should return the number of nodes for a basic circuit', () => {
    const info = getCircuitInfo(BASIC_CIRCUIT);
    expect(info).to.have.property('numOfNodes');
    expect(info.numOfNodes).to.equal(4);
  });

  it('should return the number of voltage sources for a basic circuit', () => {
    const info = getCircuitInfo(BASIC_CIRCUIT);
    expect(info).to.have.property('numOfVSources');
    expect(info.numOfVSources).to.equal(2);
  });
});

describe('solveCircuit', () => {
  it('should solve a basic circuit', () => {
    const {solution, error} = solveCircuit(BASIC_CIRCUIT, getCircuitInfo(BASIC_CIRCUIT));
    expect(error).to.equal(undefined);
    expect(solution).to.deep.equal([ 5, 5, 0, 0.5, 0.5 ]); // 5V, 5V, 0V, 0.5A, 0.5A
  });

  it('should return an error if there is a path problem');

  it('should return a blank solution if there is a path problem');

  it('should return an error for an unsolvable circuit');

  it('should return a blank solution for an unsolvable circuit');

});
