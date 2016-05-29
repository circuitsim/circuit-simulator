import {Arrays as Matrixy} from 'matrixy';
import {
  createBlankEquation,
  stampResistor,
  stampVoltageSource,
  stampCurrentSource,
  // clone,
  solve
} from '../equation';

const {createBlank} = Matrixy;

const blankThreeNodeEquation = {
  nodalAdmittances: createBlank(2, 2),
  inputs: createBlank(2, 1),
  numOfVSourcesStamped: 0,
  numOfVSources: 1,
  numOfNodes: 2
};

describe('Equation Builder initialisation', function() {
  it('should initialise a blank equation', () => {
    const equation = createBlankEquation({
      numOfNodes: 2,
      numOfVSources: 1
    });
    expect(equation).to.eql(blankThreeNodeEquation);
  });

  it('should throw an exception if given a number of nodes < 2', function() {
    expect(() => {
      createBlankEquation({
        numOfNodes: 1,
        numOfVSources: 0
      });
    }).to.throw(/.*Number of nodes.*/);
  });
});

describe('Stamping:', function() {
  describe('stamping a resistance', function() {
    it('should stamp a resistance into the nodal admittance matrix', function() {
      const equation = createBlankEquation({ numOfNodes: 3, numOfVSources: 0 });
      stampResistor(equation)(5, 1, 2);
      const {nodalAdmittances, inputs} = equation;
      expect(nodalAdmittances).to.eql([[1 / 5, -1 / 5],
                                       [-1 / 5, 1 / 5]]);
      expect(inputs).to.eql(blankThreeNodeEquation.inputs);
    });

    it('should be additive', function() {
      const equation = createBlankEquation({ numOfNodes: 3, numOfVSources: 0 });
      stampResistor(equation)(5, 0, 2);
      stampResistor(equation)(5, 1, 2);
      expect(equation.nodalAdmittances).to.eql([[1 / 5, -1 / 5],
                                                [-1 / 5, 2 / 5]]);
    });

    it('should throw an exception if resistance is zero', function() {
      const equation = createBlankEquation({ numOfNodes: 3, numOfVSources: 0 });
      expect(() => {
        stampResistor(equation)(0, 1, 2);
      }).to.throw(/.*Resistance.*/);
    });

    it('should not stamp a negative resistance', function() {
      const equation = createBlankEquation({ numOfNodes: 3, numOfVSources: 0 });
      expect(() => {
        stampResistor(equation)(-1, 1, 2);
      }).to.throw(/.*Resistance.*/);
    });
  });

  describe('stamping a voltage source', function() {
    it('should stamp a voltage into the input vector', function() {
      const equation = createBlankEquation({
        numOfNodes: 3,
        numOfVSources: 1
      });
      stampVoltageSource(equation)(5, 1, 2, 0);
      expect(equation.inputs).to.eql([[0],
                                      [0],
                                      [5]]);
    });

    it('should stamp into the augmented part of the nodal admittance matrix', function() {
      const equation = createBlankEquation({
        numOfNodes: 3,
        numOfVSources: 1
      });
      stampVoltageSource(equation)(5, 1, 2, 0);
      expect(equation.nodalAdmittances).to.eql([[0, 0, 1],
                                                [0, 0, -1],
                                                [-1, 1, 0]]);
    });

    it('should not stamp more than the specified number of voltage sources', function() {
      const equation = createBlankEquation({
        numOfNodes: 3,
        numOfVSources: 1
      });
      stampVoltageSource(equation)(5, 0, 1, 0);
      expect(() => {
        stampVoltageSource(equation)(5, 0, 1, 1);
      }).to.throw(/.*number of voltage sources.*/);
    });
  });

  describe('stamping a current source', function() {
    it('should stamp a current source', function() {
      const equation = createBlankEquation({
        numOfNodes: 3,
        numOfVSources: 0
      });
      stampCurrentSource(equation)(5, 1, 2);
      const {nodalAdmittances, inputs} = equation;
      expect(inputs).to.eql([[-5],
                             [5]]);
      expect(nodalAdmittances).to.eql(blankThreeNodeEquation.nodalAdmittances);
    });
  });
});

describe('solve', function() {
  it('should solve a simple circuit with no voltage sources', function() {
    const equation = createBlankEquation({
      numOfNodes: 2,
      numOfVSources: 0
    });
    stampCurrentSource(equation)(1, 0, 1);
    stampResistor(equation)(100, 1, 0);
    const solution = solve(equation);
    expect(solution).to.eql([[100]]);
  });

  it('should solve a simple circuit with a volage source', function() {
    const equation = createBlankEquation({
      numOfNodes: 2,
      numOfVSources: 1
    });
    stampVoltageSource(equation)(10, 0, 1, 0); // wire
    stampResistor(equation)(10, 1, 0);
    const solution = solve(equation);
    expect(solution).to.eql([[10],
                             [1]]);
  });

  it('should solve a simple circuit with a wire', function() {
    const equation = createBlankEquation({
      numOfNodes: 3,
      numOfVSources: 1
    });
    stampCurrentSource(equation)(1, 0, 1);
    stampVoltageSource(equation)(0, 1, 2, 0); // wire
    stampResistor(equation)(100, 2, 0);
    const solution = solve(equation);
    expect(solution).to.eql([[100],
                             [100],
                             [1]]);
  });
});
