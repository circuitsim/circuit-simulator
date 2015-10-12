import React from 'react';
import { Group } from 'react-art';
import { BaseData } from './models';
import DrawingUtils from '../../utils/DrawingUtils.js';
import Line from '../../utils/Line.js';
import Circle from '../../utils/Circle.js';
import { get2PointBoundingBox } from '../boundingBox.js';
import Plus from '../../utils/Plus.js';

import CurrentPath from '../CurrentPath.js';

import { getDragFunctionFor, get2ConnectorsFromDragPoints } from '../Utils.js';
import { BOUNDING_BOX_PADDING, VOLTAGE_SOURCE, GRID_SIZE } from '../Constants.js';
import { LINE_WIDTH } from '../../Constants.js';

const { PropTypes, midPoint, direction } = DrawingUtils;

const BOUNDING_BOX_WIDTH = VOLTAGE_SOURCE.RADIUS * 2 + BOUNDING_BOX_PADDING * 2;
const MIN_LENGTH = VOLTAGE_SOURCE.RADIUS * 2 + GRID_SIZE;

const BaseVoltageSourceModel = BaseData.VoltageSource;

const VoltageSource = (
    {
      connectors,
      colors
    }
  ) => {

  const [wireEnd1, wireEnd2] = connectors,

        mid = midPoint(wireEnd1, wireEnd2),
        n = direction(wireEnd1, wireEnd2),

        compOffset = n.multiply(VOLTAGE_SOURCE.RADIUS),

        compEnd1 = mid.subtract(compOffset),
        compEnd2 = mid.add(compOffset),

        plusPos = mid.add(n.multiply(VOLTAGE_SOURCE.RADIUS / 2));

  return (
    <Group>
      <Line
        color={colors[0]}
        points={[wireEnd1, compEnd1]}
        width={LINE_WIDTH}
      />
      <Line
        color={colors[1]}
        points={[wireEnd2, compEnd2]}
        width={LINE_WIDTH}
      />
      <Circle
        lineColor={colors[1]}
        lineWidth={LINE_WIDTH}
        position={{
          center: mid,
          radius: VOLTAGE_SOURCE.RADIUS
        }}
      />
      <Plus
        center={plusPos}
        lineColor={colors[1]}
      />
    </Group>
  );
};

VoltageSource.propTypes = {
  id: React.PropTypes.string,

  value: React.PropTypes.number,
  currents: React.PropTypes.arrayOf(React.PropTypes.number),
  connectors: React.PropTypes.arrayOf(PropTypes.Vector).isRequired,

  colors: React.PropTypes.arrayOf(React.PropTypes.string),

  circuitError: React.PropTypes.any
};

VoltageSource.unit = 'V';
VoltageSource.defaultValue = BaseVoltageSourceModel.value;

VoltageSource.numOfVoltages = 2;
VoltageSource.numOfConnectors = 2;
VoltageSource.dragPoint = getDragFunctionFor(MIN_LENGTH);
VoltageSource.getConnectorPositions = get2ConnectorsFromDragPoints;

VoltageSource.typeID = BaseVoltageSourceModel.typeID;

VoltageSource.width = BOUNDING_BOX_WIDTH;
VoltageSource.getBoundingBox = get2PointBoundingBox(BOUNDING_BOX_WIDTH);
VoltageSource.getCurrentPaths = ({
    currents,
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

export default VoltageSource;
