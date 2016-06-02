import { BaseData } from '../../../circuit/models';
import transforms from '../render/transforms';

import { get2PointBoundingBox } from '../boundingBox.js';

import { getDragFunctionFor } from '../Utils.js';
import {
  BOUNDING_BOX_PADDING,
  CURRENT_SOURCE,
  GRID_SIZE
} from '../Constants.js';

const { RADIUS } = CURRENT_SOURCE;
const RAD_ONE_HALF = RADIUS * 1.5;
const BOUNDING_BOX_WIDTH = CURRENT_SOURCE.RADIUS * 2 + BOUNDING_BOX_PADDING * 2;
const MIN_LENGTH = RADIUS * 3 + GRID_SIZE;

const BaseCurrentSourceModel = BaseData.CurrentSource;

const DEFAULT_CURRENT = 0.01;
const NUM_OF_CONNECTORS = 2;
export default {
  typeID: BaseCurrentSourceModel.typeID,

  numOfVoltages: 2,
  numOfCurrentPaths: 1,
  numOfConnectors: NUM_OF_CONNECTORS,

  editablesSchema: {
    current: {
      type: 'number',
      unit: 'A'
    }
  },
  defaultEditables: {
    current: {
      value: DEFAULT_CURRENT
    }
  },
  labelWith: 'current',

  width: BOUNDING_BOX_WIDTH,
  dragPoint: getDragFunctionFor(MIN_LENGTH),
  transform: transforms[NUM_OF_CONNECTORS],

  getBoundingBox: get2PointBoundingBox(BOUNDING_BOX_WIDTH),

  render: (ctx, {
    tConnectors,
    colors
  }) => {
    const [c1, c2] = tConnectors;

    ctx.beginPath();
    ctx.strokeStyle = colors[0];
    ctx.moveTo(c1.x, 0);
    ctx.lineTo(-RAD_ONE_HALF, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = colors[1];

    ctx.arc(-RADIUS / 2, 0, RADIUS, Math.PI, -Math.PI);
    ctx.moveTo(RAD_ONE_HALF, 0);
    ctx.arc(RADIUS / 2, 0, RADIUS, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(c2.x, 0);
    ctx.lineTo(RAD_ONE_HALF, 0);
    ctx.stroke();
  },

  getCurrents: (props) => {
    const {
      value: current = DEFAULT_CURRENT
    } = props;

    return [current];
  },

  renderCurrent: (props, state, renderBetween) => {
    const {
      tConnectors: [c1, c2],
      currentOffsets: [offset]
    } = props;

    renderBetween(c1, c2, offset);
  }
};
