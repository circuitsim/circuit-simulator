import { GROUND_NODE } from '../../../../Constants.js';

export default {
  data: {
    nodes: [],
    vSources: 1
  },
  functions: {
    stamp: (data, stamp) => {
      const {nodes: [node]} = data;
      stamp(0).volts.from(GROUND_NODE).to(node);
    }
  }
};
