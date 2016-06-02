import {stampCurrentSource} from '../equation';

export default {
  data: {
    nodes: []
  },
  functions: {
    stamp: (data, equation) => {
      const {
        editables: {
          current: {
            value: current
          }
        },
        nodes: [n1, n2]
      } = data;
      stampCurrentSource(equation)(current, n1, n2);
    }
  }
};
