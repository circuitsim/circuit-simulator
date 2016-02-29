import { BaseData } from '../../../circuit/models';
import { get2PointBoundingBox } from '../boundingBox.js';

import transforms from '../render/transforms';
import { getDragFunctionFor } from '../Utils.js';
import {
  BOUNDING_BOX_PADDING,
  RESISTOR,
  GRID_SIZE
} from '../Constants.js';

const BOUNDING_BOX_WIDTH = RESISTOR.WIDTH + BOUNDING_BOX_PADDING * 2;
const MIN_LENGTH = RESISTOR.LENGTH + GRID_SIZE;

const BaseResistorModel = BaseData.Resistor;


const DEFAULT_RESISTANCE = 10;
const NUM_OF_CONNECTORS = 2;
export default {
  typeID: BaseResistorModel.typeID,

  numOfVoltages: 2,
  numOfConnectors: NUM_OF_CONNECTORS,

  width: BOUNDING_BOX_WIDTH, // for label positioning
  defaultValue: DEFAULT_RESISTANCE,
  unit: 'Ω',

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
    ctx.lineTo(-RESISTOR.LENGTH / 2, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = colors[1];
    ctx.moveTo(c2.x, 0);
    ctx.lineTo(RESISTOR.LENGTH / 2, 0);
    ctx.stroke();

    const gradient = ctx.createLinearGradient(-RESISTOR.LENGTH / 2, 0, RESISTOR.LENGTH / 2, 0);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    ctx.strokeStyle = gradient;
    ctx.strokeRect(-RESISTOR.LENGTH / 2, -RESISTOR.WIDTH / 2, RESISTOR.LENGTH, RESISTOR.WIDTH);
  }
};

// TODO below

// Resistor.getCurrentPaths = ({
//     value: resistance = DEFAULT_RESISTANCE,
//     voltages = [0, 0],
//     connectors,
//     currentOffset,
//     key
//   }) => {
//   const current = (voltages[0] - voltages[1]) / resistance;
//   return (
//     <CurrentPath
//       endPoints={connectors}
//       current={current}
//       currentOffset={currentOffset}
//       key={key}
//     />
//   );
// };
