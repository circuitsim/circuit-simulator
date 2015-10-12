import React from 'react';

import { BaseData } from './models';
import DrawingUtils from '../../utils/DrawingUtils.js';
import Line from '../../utils/Line.js';
import CurrentPath from '../CurrentPath.js';
import { get2PointBoundingBox } from '../boundingBox.js';

import { getDragFunctionFor, get2ConnectorsFromDragPoints } from '../Utils.js';
import { GRID_SIZE } from '../Constants.js';
import { LINE_WIDTH } from '../../Constants.js';

const { PropTypes } = DrawingUtils;

const MIN_LENGTH = GRID_SIZE;

const BaseWireModel = BaseData.Wire;

const Wire = ({
    connectors,
    colors
  }) => {
  return (
    <Line
      color={colors[0]}
      points={connectors}
      width={LINE_WIDTH}
    />
  );
};

Wire.propTypes = {
  id: React.PropTypes.string,

  voltages: React.PropTypes.arrayOf(React.PropTypes.number),
  currents: React.PropTypes.arrayOf(React.PropTypes.number),
  connectors: React.PropTypes.arrayOf(PropTypes.Vector).isRequired,

  colors: React.PropTypes.arrayOf(React.PropTypes.string)
};

Wire.numOfVoltages = 2;
Wire.numOfConnectors = 2;
Wire.dragPoint = getDragFunctionFor(MIN_LENGTH);
Wire.getConnectorPositions = get2ConnectorsFromDragPoints;

Wire.typeID = BaseWireModel.typeID;

Wire.getBoundingBox = get2PointBoundingBox(LINE_WIDTH * 2);
Wire.getCurrentPaths = ({
    currents = [0],
    currentOffset,
    connectors
  }) => {
  return (
    <CurrentPath
      connectors={connectors}
      current={currents[0]}
      currentOffset={currentOffset}
    />
  );
};

export default Wire;
