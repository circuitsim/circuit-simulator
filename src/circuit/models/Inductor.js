import {stampConductance, stampCurrentSource} from '../equation';

const COMPANION_MODEL_TYPE = {
  // Current source in parallel with a resistor
  // Better for small time steps where Δt→0
  NORTON: {
    numVoltSources: 0
  },

  // Voltage source in series with a resistor
  // Better for DC steady state analysis where Δt→∞
  THEVENIN: {
    numVoltSources: 1,
    vSourceNums: [],
    internalNodes: 1 // NOTE we don't support internal nodes yet
  }
};

const INTEGRATION_METHOD = {
  // More accurate than FE or BE
  // Less stable than BE, more stable than FE
  TRAPEZOIDAL: {
    stampDynamic(data, equation, previousState = {}, timestep) {
      const {
        editables: {
          inductance: {
            value: inductance
          }
        },
        nodes: [n0, n1]
      } = data;

      const {
        currents: [previousCurrent] = [0],
        voltages: [pv0, pv1] = [0, 0]
      } = previousState;

      const conductance = timestep / (2 * inductance);
      stampConductance(equation)(conductance, n0, n1);

      const previousVoltage = pv0 - pv1;
      const currentSourceValue = previousCurrent + (conductance * previousVoltage);
      stampCurrentSource(equation)(currentSourceValue, n0, n1);

      return voltages => {
        const [v0, v1] = voltages;
        const resistorCurrent = (v0 - v1) * conductance;
        return [resistorCurrent + currentSourceValue];
      };
    }
  },

  // Similar accuracies, but BE is more stable
  FORWARD_EULER: 'NOT IMPLEMENTED',
  BACKWARD_EULER: 'NOT IMPLEMENTED'
};

export default {
  data: {
    nodes: [],
    ...COMPANION_MODEL_TYPE.NORTON
  },
  functions: {
    ...INTEGRATION_METHOD.TRAPEZOIDAL
  }
};
