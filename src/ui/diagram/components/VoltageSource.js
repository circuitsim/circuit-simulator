import React from 'react';
import { Group } from 'react-art';
import { BaseData } from './models/AllModels.js';
import DrawingUtils from '../../utils/DrawingUtils.js';
import Line from '../../utils/Line.js';
import Circle from '../../utils/Circle.js';
import { get2PointBoundingBox } from '../boundingBox.js';

import CurrentPath from '../CurrentPath.js';

import { getDragFunctionFor, get2ConnectorsFromDragPoints } from '../Utils.js';
import { BOUNDING_BOX_PADDING, VOLTAGE_SOURCE, GRID_SIZE } from '../Constants.js';
import { LINE_WIDTH } from '../../Constants.js';

const { PropTypes, midPoint, diff } = DrawingUtils;

const BOUNDING_BOX_WIDTH = VOLTAGE_SOURCE.RADIUS * 2 + BOUNDING_BOX_PADDING * 2;
const MIN_LENGTH = VOLTAGE_SOURCE.RADIUS * 2 + GRID_SIZE;

const BaseVoltageSourceModel = BaseData.VoltageSource;

const VoltageSource = (
    {
      connectors,
      color: propColor,
      theme
    }
  ) => {

  const [wireEnd1, wireEnd2] = connectors,

        mid = midPoint(wireEnd1, wireEnd2),
        n = diff(wireEnd1, wireEnd2).normalize(),

        compOffset = n.multiply(VOLTAGE_SOURCE.RADIUS),

        compEnd1 = mid.add(compOffset),
        compEnd2 = mid.subtract(compOffset),

        color = propColor || theme.COLORS.base;

  return (
    <Group>
      <Circle
        lineColor={color}
        lineWidth={LINE_WIDTH}
        position={{
          center: mid,
          radius: VOLTAGE_SOURCE.RADIUS
        }}
      />
      <Line
        color={color}
        points={[wireEnd1, compEnd1]}
        width={LINE_WIDTH}
      />
      <Line
        color={color}
        points={[wireEnd2, compEnd2]}
        width={LINE_WIDTH}
      />
    </Group>
  );
};

VoltageSource.propTypes = {
  id: React.PropTypes.string.isRequired,

  voltage: React.PropTypes.number,
  currents: React.PropTypes.arrayOf(React.PropTypes.number),
  connectors: React.PropTypes.arrayOf(PropTypes.Vector).isRequired,

  color: React.PropTypes.string,
  theme: React.PropTypes.object.isRequired,

  circuitError: React.PropTypes.any
};

VoltageSource.dragPoint = getDragFunctionFor(MIN_LENGTH);
VoltageSource.getConnectorPositions = get2ConnectorsFromDragPoints;

VoltageSource.typeID = BaseVoltageSourceModel.typeID;

VoltageSource.getBoundingBox = get2PointBoundingBox(BOUNDING_BOX_WIDTH);
VoltageSource.getCurrentPaths = ({
    currents,
    currentOffset,
    connectors,
    theme
  }) => {
  return (
    <CurrentPath
      connectors={connectors}
      current={currents[0]}
      currentOffset={currentOffset}
      theme={theme}
    />
  );
};

export default VoltageSource;
