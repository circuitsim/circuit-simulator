import {stampVoltageSource} from '../equation';

export default {
  data: {
    nodes: [],
    numVoltSources: 1,
    vSourceNums: []
  },
  functions: {
    stamp: (data, equation) => {
      const {nodes: [n1, n2], vSourceNums: [vNum]} = data;
      // model wire as a 0V voltage source
      // can't model as 0 ohm resistor because this causes division by zero to get conductance
      stampVoltageSource(equation)(0, n1, n2, vNum);
    }
  }
};
