import R from 'ramda';

import createEquationBuilder from 'circuit-analysis';
import {BaseData, Functions} from '..';

const {stamp} = Functions;

describe('Models', () => {
  it('should include basic components', () => {
    expect(BaseData.CurrentSource).to.be.an('object');
    expect(BaseData.Resistor).to.be.an('object');
    expect(BaseData.Wire).to.be.an('object');
  });
});

describe('Functions', () => {
  it('should include a stamp function', () => {
    expect(stamp).to.be.a('function');
  });
});

describe('Type IDs', () => {
  R.map(modelName => {
    it('should exist for ' + modelName, () => {
      const modelData = BaseData[modelName];
      expect(modelData.typeID).to.be.a('string');
    });
  }, R.keys(BaseData));
});

describe('Modelling a circuit', () => {
  it('should be able to model and solve a simple circuit with no wires (voltage sources)', () => {

    const c = BaseData.CurrentSource;
    const r = BaseData.Resistor;

    c.nodes = [0, 1];
    r.nodes = [1, 0];

    const circuit = [c, r];

    const equation = createEquationBuilder({numOfNodes: 2});

    circuit.forEach(comp => {
      stamp(comp, equation);
    });

    const solution = equation.solve();

    const v1 = c.current * r.resistance; // voltage at node 1 - V = IR
    expect(solution()).to.eql([[v1]]);
  });

  it('should be able to model and solve a simple circuit with a voltage source', () => {

    const c = BaseData.CurrentSource;
    const w = BaseData.Wire;
    const r = BaseData.Resistor;

    c.nodes = [0, 1];
    w.nodes = [1, 2];
    r.nodes = [2, 0];

    const circuit = [c, r, w];

    const equation = createEquationBuilder({numOfNodes: 3, numOfVSources: 1});

    circuit.forEach(comp => {
      stamp(comp, equation);
    });

    const solution = equation.solve();

    const v1 = c.current * r.resistance; // V = IR
    const v2 = v1;
    const iv = c.current; // current through voltage source

    expect(solution()).to.eql([[v1],
                               [v2],
                               [iv]]);

  });
});
