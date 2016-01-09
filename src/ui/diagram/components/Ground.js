import { BaseData } from '../../../circuit/models';
import transforms from '../render/transforms';

import { getDragFunctionFor } from '../Utils.js';
import { GRID_SIZE } from '../Constants.js';
import { LINE_WIDTH } from '../render';

const MIN_LENGTH = GRID_SIZE * 3;
const MAX_LENGTH = MIN_LENGTH;

const WIRE_LENTH = GRID_SIZE; // multiple of GRID_SIZE helps current flow nicely

const SIXTY_DEGREES_RAD = ((2 * Math.PI) / 360) * 60;
const SINE_SIXTY = Math.sin(SIXTY_DEGREES_RAD);

const NUM_OF_LINES = 3;
const NUM_OF_GAPS = NUM_OF_LINES - 1;
const GAP_SIZE = LINE_WIDTH * 3;
const GROUND_LENGTH = (LINE_WIDTH * NUM_OF_LINES) + (GAP_SIZE * NUM_OF_GAPS);

const Model = BaseData.Ground;

const GROUND_PATH = new Path2D();
GROUND_PATH.moveTo(0, 0);
GROUND_PATH.lineTo(WIRE_LENTH, 0);
for (let i = 0; i < NUM_OF_LINES; i++) {
  const offsetFromT = i * (GAP_SIZE + LINE_WIDTH);
  const offsetFromConnector = offsetFromT + WIRE_LENTH;
  const offsetFromEnd = GROUND_LENGTH - offsetFromT;
  const lineLength = offsetFromEnd / SINE_SIXTY;
  const halfLineLength = Math.ceil(lineLength / 2);
  GROUND_PATH.moveTo(offsetFromConnector, -halfLineLength);
  GROUND_PATH.lineTo(offsetFromConnector, halfLineLength);
}

const NUM_OF_CONNECTORS = 1;
export default {
  typeID: Model.typeID,

  numOfVoltages: 2, // including implicit ground (always 0V)
  numOfConnectors: NUM_OF_CONNECTORS,

  dragPoint: getDragFunctionFor(MIN_LENGTH, MAX_LENGTH),
  transform: transforms[NUM_OF_CONNECTORS],

  render: ctx => () => {
    ctx.stroke(GROUND_PATH);
  }
};

// Ground.getBoundingBox = get2PointBoundingBox(GROUND_LENGTH);
// Ground.getCurrentPaths = ({
//     dragPoints,
//     currents = [0],
//     currentOffset,
//     key
//   }) => {
//   const [connector] = dragPoints,
//         { positionOfT } = getShapeAttributes(dragPoints);
//   return (
//     <CurrentPath
//       /* current goes in opposite direction of drag */
//       endPoints={[positionOfT, connector]}
//       current={currents[0]}
//       currentOffset={currentOffset}
//       key={key}
//     />
//   );
// };

// export default Ground;
