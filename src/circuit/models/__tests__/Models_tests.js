import R from 'ramda';

import {createBlankEquation, solve} from '../../equation';

import {BaseData, Functions} from '../index';

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
    const c = {
      ...BaseData.CurrentSource,
      nodes: [0, 1],
      editables: {
        current: {value: 0.5}
      }
    };
    const r = {
      ...BaseData.Resistor,
      nodes: [1, 0],
      editables: {
        resistance: {value: 10}
      }
    };

    const circuit = [c, r];

    const equation = createBlankEquation({numOfNodes: 2, numOfVSources: 0});

    circuit.forEach(comp => {
      stamp(comp, equation);
    });

    const solution = solve(equation);

    const v1 = c.editables.current.value * r.editables.resistance.value;
    expect(solution).to.eql([[v1]]);
  });

  it('should be able to model and solve a simple circuit with a voltage source', () => {
    const c = {
      ...BaseData.CurrentSource,
      nodes: [0, 1],
      editables: {
        current: {value: 0.5}
      }
    };
    const w = {
      ...BaseData.Wire,
      nodes: [1, 2],
      numVoltSources: 1,
      vSourceNums: [0]
    };
    const r = {
      ...BaseData.Resistor,
      nodes: [2, 0],
      editables: {
        resistance: {value: 10}
      }
    };

    const circuit = [c, r, w];

    const equation = createBlankEquation({numOfNodes: 3, numOfVSources: 1});

    circuit.forEach(comp => {
      stamp(comp, equation);
    });

    const solution = solve(equation);

    const v1 = c.editables.current.value * r.editables.resistance.value;
    const v2 = v1;
    const iv = c.editables.current.value; // current through voltage source

    expect(solution).to.eql([[v1],
                             [v2],
                             [iv]]);

  });
});
