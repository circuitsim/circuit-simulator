import Vector from 'immutable-vector2d';

export const BASIC_CIRCUIT = {

  nodes: [
    [{viewID: 'Ground1', index: 1}],
    [{viewID: 'Ground1', index: 0},
     {viewID: 'CurrentSource1', index: 0},
     {viewID: 'Wire2', index: 1}],
    [{viewID: 'CurrentSource1', index: 1},
     {viewID: 'Wire1', index: 0}],
    [{viewID: 'Wire1', index: 1},
     {viewID: 'Resistor1', index: 0}],
    [{viewID: 'Resistor1', index: 1},
     {viewID: 'Wire2', index: 0}]
  ],
  models: {
    Ground1: {
      typeID: 'Ground',
      nodes: [1, 0],
      vSources: 1
    },
    CurrentSource1: {
      typeID: 'CurrentSource',
      nodes: [1, 2],
      current: 0.5
    },
    Wire1: {
      typeID: 'Wire',
      nodes: [2, 3],
      vSources: 1
    },
    Resistor1: {
      typeID: 'Resistor',
      nodes: [3, 4],
      resistance: 10
    },
    Wire2: {
      typeID: 'Wire',
      nodes: [4, 1],
      vSources: 1
    }
  },
  modelsNoNodes: {
    Ground1: {
      typeID: 'Ground',
      nodes: [],
      vSources: 1
    },
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
    Ground1: {
      typeID: 'Ground',
      props: {
        id: 'Ground1',
        connectors: [
          new Vector(10, 20)
        ]
      }
    },
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
    Ground1: {
      typeID: 'Ground',
      props: {
        id: 'Ground1',
        connectors: [
          new Vector(10, 20)
        ],
        voltages: [
          0,
          0
        ],
        currents: [
          0
        ]
      }
    },
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
  nodes: [
    [{viewID: 'CurrentSource1'}],
    [{viewID: 'CurrentSource1'}]
  ],
  models: {
    'CurrentSource1': {
      nodes: [0, 1],
      typeID: 'CurrentSource'
    }
  }
};

export const VOLTAGE_SOURCE_LOOP = {
  nodes: [
    [],
    [{viewID: 'Wire1'},
      {viewID: 'Wire2'}],
    [{viewID: 'Wire2'},
      {viewID: 'Wire1'}]
  ],
  models: {
    Wire1: {
      typeID: 'Wire',
      nodes: [1, 2],
      vSources: 1
    },
    Wire2: {
      typeID: 'Wire',
      nodes: [2, 1],
      vSources: 1
    }
  }
};

export const KCL_VIOLATION = {
  nodes: [
    [],
    [{viewID: 'CurrentSource2'},
      {viewID: 'Wire1'}],
    [{viewID: 'Wire1'},
      {viewID: 'CurrentSource1'}],
    [{viewID: 'CurrentSource1'},
      {viewID: 'CurrentSource2'}]
  ],
  models: {
    Wire1: {
      typeID: 'Wire',
      nodes: [1, 2],
      vSources: 1
    },
    CurrentSource1: {
      nodes: [2, 3],
      typeID: 'CurrentSource',
      current: 0.5
    },
    CurrentSource2: {
      nodes: [3, 1],
      typeID: 'CurrentSource',
      current: 0.5
    }
  }
};
