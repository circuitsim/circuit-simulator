import React from 'react';
import { Group } from 'react-art';
import { BaseData } from './models/AllModels.js';
import DrawingUtils from '../../utils/DrawingUtils.js';
import Line from '../../utils/Line.js';
import Circle from '../../utils/Circle.js';
import { get2PointBoundingBox } from '../boundingBox.js';

import CurrentPath from '../CurrentPath.js';

import { getDragFunctionFor, get2ConnectorsFromDragPoints } from '../Utils.js';
import { BOUNDING_BOX_PADDING, CURRENT_SOURCE, GRID_SIZE } from '../Constants.js';
import { LINE_WIDTH } from '../../Constants.js';

const { PropTypes, midPoint, diff } = DrawingUtils;

const BOUNDING_BOX_WIDTH = CURRENT_SOURCE.RADIUS * 2 + BOUNDING_BOX_PADDING * 2;
const MIN_LENGTH = CURRENT_SOURCE.RADIUS * 3 + GRID_SIZE;

const BaseCurrentSourceModel = BaseData.CurrentSource;

const CurrentSource = (
    {
      connectors,
      color: propColor,
      theme
    }
  ) => {

  const [wireEnd1, wireEnd2] = connectors,

        mid = midPoint(wireEnd1, wireEnd2),
        n = diff(wireEnd1, wireEnd2).normalize(),

        compOffset = n.multiply(CURRENT_SOURCE.RADIUS * 1.5),
        circleOffset = n.multiply(CURRENT_SOURCE.RADIUS / 2),

        compEnd1 = mid.add(compOffset),
        compEnd2 = mid.subtract(compOffset),

        circlePoints1 = [compEnd1, mid.subtract(circleOffset)],
        circlePoints2 = [mid.add(circleOffset), compEnd2],

        color = propColor || theme.COLORS.base;

  return (
    <Group>
      <Circle
        lineColor={color}
        lineWidth={LINE_WIDTH}
        position={{
          points: circlePoints1
        }}
      />
      <Circle
        lineColor={color}
        lineWidth={LINE_WIDTH}
        position={{
          points: circlePoints2
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

CurrentSource.propTypes = {
  id: React.PropTypes.string.isRequired,

  current: React.PropTypes.number,
  voltages: React.PropTypes.arrayOf(React.PropTypes.number),
  connectors: React.PropTypes.arrayOf(PropTypes.Vector).isRequired,

  color: React.PropTypes.string,
  theme: React.PropTypes.object.isRequired,

  circuitError: React.PropTypes.any
};

CurrentSource.dragPoint = getDragFunctionFor(MIN_LENGTH);
CurrentSource.getConnectorPositions = get2ConnectorsFromDragPoints;

CurrentSource.typeID = BaseCurrentSourceModel.typeID;

CurrentSource.getBoundingBox = get2PointBoundingBox(BOUNDING_BOX_WIDTH);
CurrentSource.getCurrentPaths = ({
    current = BaseCurrentSourceModel.current,
    connectors,
    theme,
    circuitError
  }) => {
  current = circuitError ? 0 : current;
  return (
    <CurrentPath
      connectors={connectors}
      current={current}
      theme={theme}
    />
  );
};

export default CurrentSource;
