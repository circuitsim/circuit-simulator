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
      id: 'Ground1',
      typeID: 'Ground',
      nodes: [1, 0],
      numVoltSources: 1,
      vSourceNums: [0]
    },
    CurrentSource1: {
      id: 'CurrentSource1',
      typeID: 'CurrentSource',
      nodes: [1, 2],
      editables: {
        current: {value: 0.5}
      }
    },
    Wire1: {
      id: 'Wire1',
      typeID: 'Wire',
      nodes: [2, 3],
      numVoltSources: 1,
      vSourceNums: [1]
    },
    Resistor1: {
      id: 'Resistor1',
      typeID: 'Resistor',
      nodes: [3, 4],
      editables: {
        resistance: {value: 10}
      }
    },
    Wire2: {
      id: 'Wire2',
      typeID: 'Wire',
      nodes: [4, 1],
      numVoltSources: 1,
      vSourceNums: [2]
    }
  },
  modelsNoNodes: {
    Ground1: {
      id: 'Ground1',
      typeID: 'Ground',
      nodes: [],
      numVoltSources: 1,
      vSourceNums: []
    },
    CurrentSource1: {
      id: 'CurrentSource1',
      typeID: 'CurrentSource',
      nodes: [],
      editables: {
        current: {value: 0.5}
      }
    },
    Wire1: {
      id: 'Wire1',
      typeID: 'Wire',
      nodes: [],
      numVoltSources: 1,
      vSourceNums: []
    },
    Resistor1: {
      id: 'Resistor1',
      typeID: 'Resistor',
      nodes: [],
      editables: {
        resistance: {value: 10}
      }
    },
    Wire2: {
      id: 'Wire2',
      typeID: 'Wire',
      nodes: [],
      numVoltSources: 1,
      vSourceNums: []
    }
  },
  views: {
    Ground1: {
      typeID: 'Ground',
      id: 'Ground1',
      connectors: [
        new Vector(10, 20)
      ]
    },
    CurrentSource1: {
      typeID: 'CurrentSource',
      id: 'CurrentSource1',
      editables: {
        current: {value: 0.5}
      },
      connectors: [
        new Vector(10, 20),
        new Vector(10, 10)
      ]
    },
    Wire1: {
      typeID: 'Wire',
      id: 'Wire1',
      connectors: [
        new Vector(10, 10),
        new Vector(20, 10)
      ]
    },
    Resistor1: {
      typeID: 'Resistor',
      id: 'Resistor1',
      editables: {
        resistance: {value: 10}
      },
      connectors: [
        new Vector(20, 10),
        new Vector(20, 20)
      ]
    },
    Wire2: {
      typeID: 'Wire',
      id: 'Wire2',
      connectors: [
        new Vector(20, 20),
        new Vector(10, 20)
      ]
    }
  },
  analysisResult: {
    Ground1: {
      voltages: [
        0,
        0
      ],
      currents: [
        0
      ]
    },
    CurrentSource1: {
      voltages: [
        0,
        5
      ]
    },
    Wire1: {
      currents: [
        0.5
      ],
      voltages: [
        5,
        5
      ]
    },
    Resistor1: {
      voltages: [
        5,
        0
      ]
    },
    Wire2: {
      currents: [
        0.5
      ],
      voltages: [
        0,
        0
      ]
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
      numVoltSources: 1,
      vSourceNums: [0]
    },
    Wire2: {
      typeID: 'Wire',
      nodes: [2, 1],
      numVoltSources: 1,
      vSourceNums: [1]
    }
  }
};

export const ZERO_RESISTANCE = {
  nodes: [
    [{viewID: 'Resistor1'}],
    [{viewID: 'Resistor1'}]
  ],
  models: {
    'Resistor1': {
      nodes: [0, 1],
      typeID: 'Resistor',
      editables: {
        resistance: {value: 0}
      }
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
      numVoltSources: 1,
      vSourceNums: [0]
    },
    CurrentSource1: {
      nodes: [2, 3],
      typeID: 'CurrentSource',
      editables: {
        current: {value: 0.5}
      }
    },
    CurrentSource2: {
      nodes: [3, 1],
      typeID: 'CurrentSource',
      editables: {
        current: {value: 0.5}
      }
    }
  }
};
