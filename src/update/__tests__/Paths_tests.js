import {hasPathProblem} from '../Paths.js';
import {BASIC_CIRCUIT, NO_CURRENT_PATH, VOLTAGE_SOURCE_LOOP} from './CircuitData.js';

describe('hasPathProblem()', () => {
  it('should return false for a working circuit', () => {
    const problem = hasPathProblem(BASIC_CIRCUIT);
    expect(problem).to.equal(false);
  });

  it('should return an error message for a circuit with a current source with no path for the current', () => {
    const problem = hasPathProblem(NO_CURRENT_PATH);
    expect(problem).to.be.a('string');
    expect(problem).to.contain('current');
  });

  it('should return an error message for a circuit with a voltage source loop', () => {
    const problem = hasPathProblem(VOLTAGE_SOURCE_LOOP);
    expect(problem).to.be.a('string');
    expect(problem).to.contain('loop');
  });
});
