const INITIAL_RESISTANCE = 10;

export default {
  data: {
    nodes: [],
    value: INITIAL_RESISTANCE
  },
  functions: {
    stamp: (data, equation) => {
      const {value: resistance, nodes: [n1, n2]} = data;
      equation.stampResistor(resistance, n1, n2);
    }
  }
};
