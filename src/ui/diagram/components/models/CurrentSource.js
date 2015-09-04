const INITIAL_CURRENT = 1;

export default {
  data: {
    nodes: [],
    current: INITIAL_CURRENT
  },
  functions: {
    stamp: (data, stamp) => {
      const {current, nodes: [n1, n2]} = data;
      stamp(current).amps.from(n1).to(n2);
    }
  }
};
