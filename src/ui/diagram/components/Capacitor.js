// import React from 'react';
// import { Group } from 'react-art';
// import R from 'ramda';
// import Vector from 'immutable-vector2d';
//
// import { BaseData } from '../../../circuit/models';
// import DrawingUtils from '../../utils/DrawingUtils.js';
// import Line from '../../utils/Line.js';
// import GradientLine from '../../utils/GradientLine.js';
// import CurrentPath from '../CurrentPath.js';
// import { get2PointBoundingBox } from '../boundingBox.js';
//
// import { getDragFunctionFor, get2ConnectorsFromDragPoints } from '../Utils.js';
// import { BOUNDING_BOX_PADDING, RESISTOR, GRID_SIZE } from '../Constants.js';
// import { LINE_WIDTH } from '../../Constants.js';
//
// const { getRectPointsBetween, PropTypes, midPoint, direction } = DrawingUtils;
//
// const BOUNDING_BOX_WIDTH = RESISTOR.WIDTH + BOUNDING_BOX_PADDING * 2;
// const MIN_LENGTH = RESISTOR.LENGTH + GRID_SIZE;
//
// const BaseCapacitorModel = BaseData.Capacitor;
//
// const Capacitor = ({
//     connectors,
//     colors
//   }) => {
//
//   return ();
// };
//
// Capacitor.propTypes = {
//   connectors: React.PropTypes.arrayOf(PropTypes.Vector).isRequired,
//   colors: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
// };
//
// const DEFAULT_CAPACITANCE = 1e-6;
// Capacitor.unit = 'F';
// Capacitor.defaultValue = DEFAULT_CAPACITANCE;
//
// Capacitor.numOfVoltages = 2;
// Capacitor.numOfConnectors = 2;
// Capacitor.dragPoint = getDragFunctionFor(MIN_LENGTH);
// Capacitor.getConnectorPositions = get2ConnectorsFromDragPoints;
//
// Capacitor.typeID = BaseCapacitorModel.typeID;
//
// Capacitor.width = BOUNDING_BOX_WIDTH;
// Capacitor.getBoundingBox = get2PointBoundingBox(BOUNDING_BOX_WIDTH);
// Capacitor.getCurrentPaths = ({
//     value: resistance = DEFAULT_CAPACITANCE,
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
//
// export default Capacitor;
