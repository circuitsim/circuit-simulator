import R from 'ramda';
import {stampResistor, stampCurrentSource} from '../equation';

const COMPANION_MODEL_TYPE = {
  // Current source in parallel with a resistor
  // Better for small time steps where Δt→0
  NORTON: {
    vSources: 0,
    internalNodes: 0 // NOTE we don't support internal nodes yet
  },

  // Voltage source in series with a resistor
  // Better for DC steady state analysis where Δt→∞
  THEVENIN: {
    vSources: 1,
    internalNodes: 1
  }
};

const INTEGRATION_METHOD = {
  // More accurate than FE or BE
  // Less stable than BE, more stable than FE
  TRAPEZOIDAL: {
    stampDynamic(data, equation, previousState, timestep) {
      const {value: capacitance, nodes: [n1, n2]} = data;
      const {current: oldCurrent, voltages: [v1, v2]} = previousState;

      const resistance = timestep / (2 * capacitance);
      stampResistor(equation)(resistance, n1, n2);

      const current = -(v1 - v2) / resistance - oldCurrent;
      stampCurrentSource(equation)(current, n1, n2);
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
