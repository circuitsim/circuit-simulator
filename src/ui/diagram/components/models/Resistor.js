const INITIAL_RESISTANCE = 1000;

export default {
  data: {
    nodes: [],
    resistance: INITIAL_RESISTANCE
  },
  functions: {
    stamp: (data, stamp) => {
      const {resistance, nodes: [n1, n2]} = data;
      stamp(resistance).ohms.between(n1, n2);
    }
  }
};
