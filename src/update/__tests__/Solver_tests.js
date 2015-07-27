import {getCircuitInfo} from '../Solver.js';
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
