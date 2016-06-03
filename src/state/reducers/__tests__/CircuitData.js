import Vector from 'immutable-vector2d';

export const RC_CIRCUIT = {
  // nodes: [
  //   [{viewID: 'Ground', index: 1}],
  //   [{viewID: 'Ground', index: 0},
  //    {viewID: 'VoltageSource', index: 0},
  //    {viewID: 'Capacitor', index: 1}],
  //   [{viewID: 'VoltageSource', index: 1},
  //    {viewID: 'Resistor', index: 0}],
  //   [{viewID: 'Capacitor', index: 1},
  //    {viewID: 'Resistor', index: 1}]
  // ],
  // models: {
  //   Ground: {
  //     typeID: 'Ground',
  //     nodes: [1, 0],
  //     numVoltSources: 1
  //   },
  //   VoltageSource: {
  //     typeID: 'VoltageSource',
  //     nodes: [1, 2],
  //     value: 5
  //   },
  //   Resistor: {
  //     typeID: 'Resistor',
  //     nodes: [2, 3],
  //     value: 100
  //   },
  //   Capacitor: {
  //     typeID: 'Capacitor',
  //     nodes: [3, 1],
  //     value: 5e-6
  //   }
  // },
  views: {
    Ground: {
      typeID: 'Ground',
      id: 'Ground',
      connectors: [
        new Vector(10, 20)
      ]
    },
    VoltageSource: {
      typeID: 'VoltageSource',
      id: 'VoltageSource',
      editables: {
        type: {value: 'DC'},
        voltage: {value: 5},
        frequency: {value: 500}
      },
      connectors: [
        new Vector(10, 20),
        new Vector(10, 10)
      ]
    },
    Resistor: {
      typeID: 'Resistor',
      id: 'Resistor',
      editables: {
        resistance: {value: 100}
      },
      connectors: [
        new Vector(10, 10),
        new Vector(20, 20)
      ]
    },
    Capacitor: {
      typeID: 'Capacitor',
      id: 'Capacitor',
      editables: {
        capacitance: {value: 5e-6}
      },
      connectors: [
        new Vector(20, 20),
        new Vector(10, 20)
      ]
    }
  }
};
