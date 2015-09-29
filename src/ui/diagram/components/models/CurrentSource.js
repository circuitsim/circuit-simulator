const INITIAL_CURRENT = 1;

export default {
  data: {
    nodes: [],
    current: INITIAL_CURRENT
  },
  functions: {
    stamp: (data, equation) => {
      const {current, nodes: [n1, n2]} = data;
      equation.stampCurrentSource(current, n1, n2);
    }
  }
};
