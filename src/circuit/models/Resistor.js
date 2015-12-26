export default {
  data: {
    nodes: []
  },
  functions: {
    stamp: (data, equation) => {
      const {value: resistance, nodes: [n1, n2]} = data;
      equation.stampResistor(resistance, n1, n2);
    }
  }
};
