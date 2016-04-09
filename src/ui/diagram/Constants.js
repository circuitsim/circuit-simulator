const CONSTANTS = {
  LINE_WIDTH: 2,

  GRID_SIZE: 20,

  DRAG_POINT_RADIUS: 8,

  BOUNDING_BOX_PADDING: 4,

  RESISTOR: {
    LENGTH: 40,
    WIDTH: 12
  },

  CAPACITOR: {
    WIDTH: 26,
    GAP: 10
  },

  INDUCTOR: {
    WIDTH: 12,
    RADIUS: 8
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
