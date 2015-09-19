import Vector from 'immutable-vector2d';

export const BASIC_CIRCUIT = {

  nodes: [
    [{viewID: 'CurrentSource1', index: 0},
     {viewID: 'Wire2', index: 1}],
    [{viewID: 'CurrentSource1', index: 1},
     {viewID: 'Wire1', index: 0}],
    [{viewID: 'Wire1', index: 1},
     {viewID: 'Resistor1', index: 0}],
    [{viewID: 'Resistor1', index: 1},
     {viewID: 'Wire2', index: 0}]
  ],
  models: {
    CurrentSource1: {
      typeID: 'CurrentSource',
      nodes: [0, 1],
      current: 0.5
    },
    Wire1: {
      typeID: 'Wire',
      nodes: [1, 2],
      vSources: 1
    },
    Resistor1: {
      typeID: 'Resistor',
      nodes: [2, 3],
      resistance: 10
    },
    Wire2: {
      typeID: 'Wire',
      nodes: [3, 0],
      vSources: 1
    }
  },
  modelsNoNodes: {
    CurrentSource1: {
      typeID: 'CurrentSource',
      nodes: [],
      current: 0.5
    },
    Wire1: {
      typeID: 'Wire',
      nodes: [],
      vSources: 1
    },
    Resistor1: {
      typeID: 'Resistor',
      nodes: [],
      resistance: 10
    },
    Wire2: {
      typeID: 'Wire',
      nodes: [],
      vSources: 1
    }
  },
  views: {
    CurrentSource1: {
      typeID: 'CurrentSource',
      props: {
        id: 'CurrentSource1',
        connectors: [
          new Vector(10, 20),
          new Vector(10, 10)
        ]
      }
    },
    Wire1: {
      typeID: 'Wire',
      props: {
        id: 'Wire1',
        connectors: [
          new Vector(10, 10),
          new Vector(20, 10)
        ]
      }
    },
    Resistor1: {
      typeID: 'Resistor',
      props: {
        id: 'Resistor1',
        connectors: [
          new Vector(20, 10),
          new Vector(20, 20)
        ]
      }
    },
    Wire2: {
      typeID: 'Wire',
      props: {
        id: 'Wire2',
        connectors: [
          new Vector(20, 20),
          new Vector(10, 20)
        ]
      }
    }
  },
  viewsSolution: {
    CurrentSource1: {
      typeID: 'CurrentSource',
      props: {
        id: 'CurrentSource1',
        connectors: [
          new Vector(10, 20),
          new Vector(10, 10)
        ],
        voltages: [
          0,
          5
        ]
      }
    },
    Wire1: {
      typeID: 'Wire',
      props: {
        id: 'Wire1',
        connectors: [
          new Vector(10, 10),
          new Vector(20, 10)
        ],
        currents: [
          0.5
        ],
        voltages: [
          5,
          5
        ]
      }
    },
    Resistor1: {
      typeID: 'Resistor',
      props: {
        id: 'Resistor1',
        connectors: [
          new Vector(20, 10),
          new Vector(20, 20)
        ],
        voltages: [
          5,
          0
        ]
      }
    },
    Wire2: {
      typeID: 'Wire',
      props: {
        id: 'Wire2',
        connectors: [
          new Vector(20, 20),
          new Vector(10, 20)
        ],
        currents: [
          0.5
        ],
        voltages: [
          0,
          0
        ]
      }
    }
  }

};

export const NO_CURRENT_PATH = {
  nodes: {
    0: [{viewID: 'CurrentSource1'}],
    1: [{viewID: 'CurrentSource1'}]
  },
  models: {
    'CurrentSource1': {
      nodes: [0, 1],
      typeID: 'CurrentSource'
    }
  }
};

export const VOLTAGE_SOURCE_LOOP = {
  nodes: {
    0: [{viewID: 'Wire1'},
        {viewID: 'Wire2'}],
    1: [{viewID: 'Wire2'},
        {viewID: 'Wire1'}]
  },
  models: {
    Wire1: {
      typeID: 'Wire',
      nodes: [0, 1],
      vSources: 1
    },
    Wire2: {
      typeID: 'Wire',
      nodes: [1, 0],
      vSources: 1
    }
  }
};

export const KCL_VIOLATION = {
  nodes: {
    0: [{viewID: 'CurrentSource2'},
        {viewID: 'Wire1'}],
    1: [{viewID: 'Wire1'},
        {viewID: 'CurrentSource1'}],
    2: [{viewID: 'CurrentSource1'},
        {viewID: 'CurrentSource2'}]
  },
  models: {
    Wire1: {
      typeID: 'Wire',
      nodes: [0, 1],
      vSources: 1
    },
    CurrentSource1: {
      nodes: [1, 2],
      typeID: 'CurrentSource',
      current: 0.5
    },
    CurrentSource2: {
      nodes: [2, 0],
      typeID: 'CurrentSource',
      current: 0.5
    }
  }
};
