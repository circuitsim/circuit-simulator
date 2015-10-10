const INITIAL_CURRENT = 0.5;

export default {
  data: {
    nodes: [],
    value: INITIAL_CURRENT
  },
  functions: {
    stamp: (data, equation) => {
      const {value: current, nodes: [n1, n2]} = data;
      equation.stampCurrentSource(current, n1, n2);
    }
  }
};
