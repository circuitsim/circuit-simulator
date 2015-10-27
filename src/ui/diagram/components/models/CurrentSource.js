export default {
  data: {
    nodes: []
  },
  functions: {
    stamp: (data, equation) => {
      const {value: current, nodes: [n1, n2]} = data;
      equation.stampCurrentSource(current, n1, n2);
    }
  }
};
