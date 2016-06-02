import {stampVoltageSource} from '../equation';

export default {
  data: {
    nodes: [],
    numVoltSources: 1,
    vSourceNums: []
  },
  functions: {
    stamp: (data, equation) => {
      const {
        editables: {
          type: {
            value: type
          },
          voltage: {
            value: voltage
          }
        },
        nodes: [n1, n2],
        vSourceNums: [vNum]
      } = data;

      switch (type.toLowerCase()) {
      case 'dc': {
        stampVoltageSource(equation)(voltage, n1, n2, vNum);
        break;
      }
      }
    },

    stampDynamic(data, equation, previousState = {}, timestep, simTime) {
      const {
        editables: {
          type: {
            value: type
          },
          voltage: {
            value: amplitude
          },
          frequency: {
            value: frequency,
            zeroTime
          }
        },
        nodes: [n1, n2],
        vSourceNums: [vNum]
      } = data;

      switch (type.toLowerCase()) {
      case 'sine': {
        const w = 2 * Math.PI * (simTime - zeroTime) * frequency;
        const voltage = Math.sin(w) * amplitude;
        stampVoltageSource(equation)(voltage, n1, n2, vNum);
        break;
      }
      }
    }
  }
};
