import {
  getCircuitInfo,
  checkForProblems,
  stampStaticEquation,
  solveEquation
} from '../Solver.js';
import {BASIC_CIRCUIT, NO_CURRENT_PATH, KCL_VIOLATION} from './CircuitData.js';

function isTruthy(x) { return x ? true : false; }
function isFalsy(x) { return !isTruthy(x); }

function getCircuitGraph(circuit) {
  return {
    ...circuit,
    ...getCircuitInfo(circuit)
  };
}

describe('getCircuitInfo()', () => {
  it('should return the number of nodes for a basic circuit', () => {
    const info = getCircuitInfo(BASIC_CIRCUIT);
    expect(info).to.have.property('numOfNodes');
    expect(info.numOfNodes).to.equal(5);
  });

  it('should return the number of voltage sources for a basic circuit', () => {
    const info = getCircuitInfo(BASIC_CIRCUIT);
    expect(info).to.have.property('numOfVSources');
    expect(info.numOfVSources).to.equal(3);
  });
});

describe('checkForProblems()', () => {
  it('should return an error if there is a path problem', () => {
    const error = checkForProblems(getCircuitGraph(NO_CURRENT_PATH));
    expect(error).to.satisfy(isTruthy);
  });
});

describe('solving static circuits', () => {
  it('should solve a basic circuit', () => {
    const equation = stampStaticEquation(getCircuitGraph(BASIC_CIRCUIT));
    const {solution, error} = solveEquation(equation);
    expect(error).to.satisfy(isFalsy);
    expect(solution).to.almost.eql([ 0, 5, 5, 0, 0, 0.5, 0.5 ], 3); // 0V, 5V, 5V, 0V, 0A, 0.5A, 0.5A
  });

  it('should return an error for an unsolvable circuit', () => {
    const equation = stampStaticEquation(getCircuitGraph(KCL_VIOLATION));
    const {error} = solveEquation(equation);
    expect(error).to.satisfy(isTruthy);
  });

  it('should return a blank solution for an unsolvable circuit', () => {
    const equation = stampStaticEquation(getCircuitGraph(KCL_VIOLATION));
    const {solution} = solveEquation(equation);
    expect(solution).to.deep.equal([ 0, 0, 0, 0 ]);
  });
});

describe('solving a dynamic circuit', () => {
  it('should solve a basic circuit with a capacitor');
});
