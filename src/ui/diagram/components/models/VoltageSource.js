const INITIAL_VOLTAGE = 5;

export default {
  data: {
    nodes: [],
    value: INITIAL_VOLTAGE,
    vSources: 1
  },
  functions: {
    stamp: (data, equation) => {
      const {value: voltage, nodes: [n1, n2]} = data;
      equation.stampVoltageSource(voltage, n1, n2);
    }
  }
};
