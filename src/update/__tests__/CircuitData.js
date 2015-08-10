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
      typeID: 'CurrentSource',
      current: 0.5
    },
    'Wire1': {
      typeID: 'Wire',
      nodes: [1, 2],
      vSources: 1
    },
    'Resistor1': {
      nodes: [2, 3],
      typeID: 'Resistor',
      resistance: 10
    },
    'Wire2': {
      typeID: 'Wire',
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
    'Wire1': {
      typeID: 'Wire',
      nodes: [0, 1],
      vSources: 1
    },
    'Wire2': {
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
    'Wire1': {
      typeID: 'Wire',
      nodes: [0, 1],
      vSources: 1
    },
    'CurrentSource1': {
      nodes: [1, 2],
      typeID: 'CurrentSource',
      current: 0.5
    },
    'CurrentSource2': {
      nodes: [2, 0],
      typeID: 'CurrentSource',
      current: 0.5
    }
  }
};
