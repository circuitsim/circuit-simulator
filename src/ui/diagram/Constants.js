const CONSTANTS = {
  LINE_WIDTH: 2,

  GRID_SIZE: 20,

  DRAG_POINT_RADIUS: 8,

  BOUNDING_BOX_PADDING: 4,

  RESISTOR: {
    WIDTH: 12,
    LENGTH: 40
  },

  CAPACITOR: {
    WIDTH: 26,
    GAP: 6
  },

  CURRENT_SOURCE: {
    RADIUS: 18
  },
  VOLTAGE_SOURCE: {
    RADIUS: 22
  }
};

CONSTANTS.CURRENT = {
  DOT_DISTANCE: CONSTANTS.GRID_SIZE, // this makes the current flow nicely at the joins
  RADIUS: 4
};

export default CONSTANTS;
