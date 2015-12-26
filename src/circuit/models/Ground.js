import { GROUND_NODE } from '../../Constants.js';
import { stampVoltageSource } from '../equation';

export default {
  data: {
    nodes: [],
    vSources: 1
  },
  functions: {
    stamp: (data, equation) => {
      const {nodes: [node]} = data;
      stampVoltageSource(equation)(0, GROUND_NODE, node);
    }
  }
};
