import React from 'react';
import { Group } from 'react-art';
import { BaseData } from './models';
import DrawingUtils from '../../utils/DrawingUtils.js';
import Line from '../../utils/Line.js';
import Circle from '../../utils/Circle.js';
import { get2PointBoundingBox } from '../boundingBox.js';

import CurrentPath from '../CurrentPath.js';

import { getDragFunctionFor, get2ConnectorsFromDragPoints } from '../Utils.js';
import { BOUNDING_BOX_PADDING, CURRENT_SOURCE, GRID_SIZE } from '../Constants.js';
import { LINE_WIDTH } from '../../Constants.js';

const { PropTypes, midPoint, direction } = DrawingUtils;

const BOUNDING_BOX_WIDTH = CURRENT_SOURCE.RADIUS * 2 + BOUNDING_BOX_PADDING * 2;
const MIN_LENGTH = CURRENT_SOURCE.RADIUS * 3 + GRID_SIZE;

const BaseCurrentSourceModel = BaseData.CurrentSource;

const CurrentSource = (
    {
      connectors,
      colors
    }
  ) => {

  const [wireEnd1, wireEnd2] = connectors,

        mid = midPoint(wireEnd1, wireEnd2),
        n = direction(wireEnd1, wireEnd2),

        compOffset = n.multiply(CURRENT_SOURCE.RADIUS * 1.5),
        circleOffset = n.multiply(CURRENT_SOURCE.RADIUS / 2),

        compEnd1 = mid.subtract(compOffset),
        compEnd2 = mid.add(compOffset),

        circlePoints1 = [compEnd1, mid.add(circleOffset)],
        circlePoints2 = [mid.subtract(circleOffset), compEnd2];

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
          points: circlePoints1
        }}
      />
      <Circle
        lineColor={colors[1]}
        lineWidth={LINE_WIDTH}
        position={{
          points: circlePoints2
        }}
      />
    </Group>
  );
};

CurrentSource.propTypes = {
  id: React.PropTypes.string,

  value: React.PropTypes.number,
  voltages: React.PropTypes.arrayOf(React.PropTypes.number),
  connectors: React.PropTypes.arrayOf(PropTypes.Vector).isRequired,

  colors: React.PropTypes.arrayOf(React.PropTypes.string),

  circuitError: React.PropTypes.any
};

CurrentSource.unit = 'A';
CurrentSource.defaultValue = BaseCurrentSourceModel.value;

CurrentSource.numOfVoltages = 2;
CurrentSource.numOfConnectors = 2;
CurrentSource.dragPoint = getDragFunctionFor(MIN_LENGTH);
CurrentSource.getConnectorPositions = get2ConnectorsFromDragPoints;

CurrentSource.typeID = BaseCurrentSourceModel.typeID;

CurrentSource.width = BOUNDING_BOX_WIDTH;
CurrentSource.getBoundingBox = get2PointBoundingBox(BOUNDING_BOX_WIDTH);
CurrentSource.getCurrentPaths = ({
    value: current = BaseCurrentSourceModel.value,
    currentOffset,
    connectors,
    circuitError
  }) => {
  current = circuitError ? 0 : current;
  return (
    <CurrentPath
      connectors={connectors}
      current={current}
      currentOffset={currentOffset}
    />
  );
};

export default CurrentSource;
