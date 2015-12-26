export default {
  data: {
    nodes: [],
    vSources: 1
  },
  functions: {
    stamp: (data, equation) => {
      const {nodes: [n1, n2]} = data;
      // model wire as a 0V voltage source
      equation.stampVoltageSource(0, n1, n2);
      // can't model as 0 ohm resistor because this causes division by zero to get conductance
    }
  }
};
