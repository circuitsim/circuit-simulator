import { GROUND_NODE } from '../../Constants.js';

export default {
  data: {
    nodes: [],
    vSources: 1
  },
  functions: {
    stamp: (data, equation) => {
      const {nodes: [node]} = data;
      equation.stampVoltageSource(0, GROUND_NODE, node);
    }
  }
};
