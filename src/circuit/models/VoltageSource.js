import {stampVoltageSource} from '../equation';

export default {
  data: {
    nodes: [],
    vSources: 1
  },
  functions: {
    stamp: (data, equation) => {
      const {
        options: {
          voltage: {
            value: voltage
          }
        },
        nodes: [n1, n2]
      } = data;
      stampVoltageSource(equation)(voltage, n1, n2);
    }
  }
};
