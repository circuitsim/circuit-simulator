import R from 'ramda';
import {stampResistor, stampCurrentSource} from '../equation';

const COMPANION_MODEL_TYPE = {
  // Current source in parallel with a resistor
  // Better for small time steps where Δt→0
  NORTON: {
    vSources: 0
  },

  // Voltage source in series with a resistor
  // Better for DC steady state analysis where Δt→∞
  THEVENIN: {
    vSources: 1,
    internalNodes: 1 // NOTE we don't support internal nodes yet
  }
};

const INTEGRATION_METHOD = {
  // More accurate than FE or BE
  // Less stable than BE, more stable than FE
  TRAPEZOIDAL: {
    stampDynamic(data, equation, previousState = {}, timestep) {
      const {
        value: capacitance,
        nodes: [n1, n2]
      } = data;

      const {
        currents: [curr] = [0],
        voltages: [v0, v1] = [0, 0]
      } = previousState;

      const resistance = timestep / (2 * capacitance);
      stampResistor(equation)(resistance, n1, n2);

      const currentSourceValue = -(v0 - v1) / resistance - curr;
      stampCurrentSource(equation)(currentSourceValue, n1, n2);

      return voltages => {
        const vs = voltages;
        return [(vs[0] - vs[1]) / resistance + currentSourceValue];
      };
    }
  },

  // Similar accuracies, but BE is more stable
  FORWARD_EULER: 'NOT IMPLEMENTED',
  BACKWARD_EULER: 'NOT IMPLEMENTED'
};

export default {
  data: R.merge({
    nodes: []
  }, COMPANION_MODEL_TYPE.NORTON),
  functions: {
    ...INTEGRATION_METHOD.TRAPEZOIDAL
  }
};
