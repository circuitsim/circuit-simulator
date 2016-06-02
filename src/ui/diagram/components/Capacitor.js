import { BaseData } from '../../../circuit/models';
import { get2PointBoundingBox } from '../boundingBox.js';

import transforms from '../render/transforms';
import { getDragFunctionFor } from '../Utils.js';
import {
  BOUNDING_BOX_PADDING,
  CAPACITOR,
  CURRENT,
  GRID_SIZE
} from '../Constants.js';

const BOUNDING_BOX_WIDTH = CAPACITOR.WIDTH + BOUNDING_BOX_PADDING * 2;
const MIN_LENGTH = CAPACITOR.GAP + GRID_SIZE;
const ORIGIN_TO_PLATE = CAPACITOR.GAP / 2;

const BaseCapacitorModel = BaseData.Capacitor;

const DEFAULT_CAPACITANCE = 10e-6;
const NUM_OF_CONNECTORS = 2;
export default {
  typeID: BaseCapacitorModel.typeID,

  numOfVoltages: 2,
  numOfCurrentPaths: 1,
  numOfConnectors: NUM_OF_CONNECTORS,

  width: BOUNDING_BOX_WIDTH, // for label positioning
  editablesSchema: {
    capacitance: {
      type: 'number',
      unit: 'F'
    }
  },
  defaultEditables: {
    capacitance: {
      value: DEFAULT_CAPACITANCE
    }
  },
  labelWith: 'capacitance',

  dragPoint: getDragFunctionFor(MIN_LENGTH),
  transform: transforms[NUM_OF_CONNECTORS],

  getBoundingBox: get2PointBoundingBox(BOUNDING_BOX_WIDTH),

  render: (ctx, props) => {
    const {
      tConnectors,
      colors
    } = props;

    const [c1, c2] = tConnectors;

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
      tConnectors: [c1, c2],
      currentOffsets: [offset]
    } = props;

    const c1ToSecondPlate = Math.abs(c1.x) + ORIGIN_TO_PLATE;
    const offsetAtZero = CURRENT.DOT_DISTANCE - (c1ToSecondPlate % CURRENT.DOT_DISTANCE);
    const offsetFrom2ndPlate = (offset + offsetAtZero) % CURRENT.DOT_DISTANCE;

    renderBetween(c1, {x: -ORIGIN_TO_PLATE, y: 0}, offset);
    renderBetween({x: ORIGIN_TO_PLATE, y: 0}, c2, offsetFrom2ndPlate);
  }
};
