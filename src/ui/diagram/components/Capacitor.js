import { BaseData } from '../../../circuit/models';
import { get2PointBoundingBox } from '../boundingBox.js';

import transforms from '../render/transforms';
import { getDragFunctionFor } from '../Utils.js';
import {
  BOUNDING_BOX_PADDING,
  CAPACITOR,
  GRID_SIZE
} from '../Constants.js';

const BOUNDING_BOX_WIDTH = CAPACITOR.WIDTH + BOUNDING_BOX_PADDING * 2;
const MIN_LENGTH = CAPACITOR.LENGTH + GRID_SIZE;

const BaseCapacitorModel = BaseData.Capacitor;

const DEFAULT_CAPACITANCE = 10e-6;
const NUM_OF_CONNECTORS = 2;
export default {
  typeID: BaseCapacitorModel.typeID,

  numOfVoltages: 2,
  numOfCurrentPaths: 1,
  numOfConnectors: NUM_OF_CONNECTORS,

  width: BOUNDING_BOX_WIDTH, // for label positioning
  defaultValue: DEFAULT_CAPACITANCE,
  unit: 'F',

  dragPoint: getDragFunctionFor(MIN_LENGTH),
  transform: transforms[NUM_OF_CONNECTORS],

  getBoundingBox: get2PointBoundingBox(BOUNDING_BOX_WIDTH),

  render: (ctx, props) => {
    const {
      connectors,
      colors
    } = props;

    const [c1, c2] = connectors;

    ctx.beginPath();
    ctx.strokeStyle = colors[0];
    ctx.moveTo(c1.x, 0);
    ctx.lineTo(-CAPACITOR.GAP / 2, 0);
    ctx.stroke();

    ctx.moveTo(-CAPACITOR.GAP / 2, -CAPACITOR.WIDTH / 2);
    ctx.lineTo(-CAPACITOR.GAP / 2, CAPACITOR.WIDTH / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = colors[1];
    ctx.moveTo(c2.x, 0);
    ctx.lineTo(CAPACITOR.GAP / 2, 0);
    ctx.stroke();

    ctx.moveTo(CAPACITOR.GAP / 2, -CAPACITOR.WIDTH / 2);
    ctx.lineTo(CAPACITOR.GAP / 2, CAPACITOR.WIDTH / 2);
    ctx.stroke();
  },

  getCurrents: (props, state) => {
    const {
      currents = [0]
    } = state;

    return currents;
  },

  renderCurrent: (props, state, renderBetween) => {
    const {
      connectors: [c1, c2],
      currentOffsets: [offset]
    } = props;

    renderBetween(c1, {x: -CAPACITOR.GAP / 2, y: 0}, offset);
    renderBetween({x: CAPACITOR.GAP / 2, y: 0}, c2, offset);
  }
};
