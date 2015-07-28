export const BASIC_CIRCUIT = {
  nodes: {
    0: [{viewID: 'Wire2'},
        {viewID: 'CurrentSource1'}],
    1: [{viewID: 'CurrentSource1'},
        {viewID: 'Wire1'}],
    2: [{viewID: 'Wire1'},
        {viewID: 'Resistor1'}],
    3: [{viewID: 'Resistor1'},
        {viewID: 'Wire2'}]
  },
  models: {
    'CurrentSource1': {
      nodes: [0, 1],
      type: 'CurrentSource',
      current: 0.5
    },
    'Wire1': {
      type: 'Wire',
      nodes: [1, 2],
      vSources: 1
    },
    'Resistor1': {
      nodes: [2, 3],
      type: 'Resistor',
      resistance: 10
    },
    'Wire2': {
      type: 'Wire',
      nodes: [3, 0],
      vSources: 1
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
      type: 'CurrentSource'
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
    'Wire1': {
      type: 'Wire',
      nodes: [0, 1],
      vSources: 1
    },
    'Wire2': {
      type: 'Wire',
      nodes: [1, 0],
      vSources: 1
    }
  }
};
