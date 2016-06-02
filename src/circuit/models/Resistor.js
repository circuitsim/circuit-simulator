import {stampResistor} from '../equation';

export default {
  data: {
    nodes: []
  },
  functions: {
    stamp: (data, equation) => {
      const {
        editables: {
          resistance: {
            value: resistance
          }
        },
        nodes: [n1, n2]
      } = data;
      stampResistor(equation)(resistance, n1, n2);
    }
  }
};
