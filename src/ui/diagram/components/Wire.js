import { BaseData } from '../../../circuit/models';
import transforms from '../render/transforms';

import { get2PointBoundingBox } from '../boundingBox.js';

import { getDragFunctionFor } from '../Utils.js';
import { GRID_SIZE, LINE_WIDTH } from '../Constants.js';

const MIN_LENGTH = GRID_SIZE;

const BaseWireModel = BaseData.Wire;

const NUM_OF_CONNECTORS = 2;
export default {
  typeID: BaseWireModel.typeID,

  numOfVoltages: 2,
  numOfConnectors: NUM_OF_CONNECTORS,

  dragPoint: getDragFunctionFor(MIN_LENGTH),
  transform: transforms[NUM_OF_CONNECTORS],

  getBoundingBox: get2PointBoundingBox(LINE_WIDTH * 2),

  render: (ctx, props) => {
    const {
      connectors,
      colors
    } = props;

    ctx.strokeStyle = colors[0];

    const [c1, c2] = connectors;
    ctx.beginPath();
    ctx.moveTo(c1.x, 0);
    ctx.lineTo(c2.x, 0);
    ctx.stroke();
  },

  renderCurrent: (props, state, renderBetween) => {
    const {
      connectors
    } = props;
    const [c1, c2] = connectors;

    const {
      currents = [0]
    } = state;

    renderBetween(c1, c2, currents[0]);
  }
};
