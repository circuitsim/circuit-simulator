const INITIAL_RESISTANCE = 10;

export default {
  data: {
    nodes: [],
    resistance: INITIAL_RESISTANCE
  },
  functions: {
    stamp: (data, equation) => {
      const {resistance, nodes: [n1, n2]} = data;
      equation.stampResistor(resistance, n1, n2);
    }
  }
};
