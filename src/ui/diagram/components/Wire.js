import { BaseData } from '../../../circuit/models';
import transforms from '../render/transforms';

// import { get2PointBoundingBox } from '../boundingBox.js';

import { getDragFunctionFor } from '../Utils.js';
import { GRID_SIZE } from '../Constants.js';

const MIN_LENGTH = GRID_SIZE;

const BaseWireModel = BaseData.Wire;

const NUM_OF_CONNECTORS = 2;
export default {
  typeID: BaseWireModel.typeID,

  numOfVoltages: 2,
  numOfConnectors: NUM_OF_CONNECTORS,

  dragPoint: getDragFunctionFor(MIN_LENGTH),
  transform: transforms[NUM_OF_CONNECTORS],

  render: (ctx, { connectors }) => {
    const [c1, c2] = connectors;
    ctx.beginPath();
    ctx.moveTo(c1.x, 0);
    ctx.lineTo(c2.x, 0);
    ctx.stroke();
  }
};

// Wire.getBoundingBox = get2PointBoundingBox(LINE_WIDTH * 2);
// Wire.getCurrentPaths = ({
//     currents = [0],
//     currentOffset,
//     connectors,
//     key
//   }) => {
//   return (
//     <CurrentPath
//       endPoints={connectors}
//       current={currents[0]}
//       currentOffset={currentOffset}
//       key={key}
//     />
//   );
// };
//
// export default Wire;
