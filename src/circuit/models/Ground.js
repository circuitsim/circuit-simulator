import { GROUND_NODE } from '../../Constants.js';
import { stampVoltageSource } from '../equation';

export default {
  data: {
    nodes: [],
    numVoltSources: 1,
    vSourceNums: []
  },
  functions: {
    stamp: (data, equation) => {
      const {nodes: [node], vSourceNums: [vNum]} = data;
      stampVoltageSource(equation)(0, GROUND_NODE, node, vNum);
    }
  }
};
