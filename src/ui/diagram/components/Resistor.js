import React from 'react';
import { Shape, Group } from 'react-art';
import { BaseData } from './models/AllModels.js';
import DrawingUtils from '../../utils/DrawingUtils.js';
import Line from '../../utils/Line.js';
import CurrentPath from '../CurrentPath.js';
import { get2PointBoundingBox } from '../boundingBox.js';

import { getDragFunctionFor, get2ConnectorsFromDragPoints } from '../Utils.js';
import { BOUNDING_BOX_PADDING, RESISTOR, GRID_SIZE } from '../Constants.js';
import { LINE_WIDTH } from '../../Constants.js';

const { getRectPathBetween, PropTypes, midPoint, diff } = DrawingUtils;

const BOUNDING_BOX_WIDTH = RESISTOR.WIDTH + BOUNDING_BOX_PADDING * 2;
const MIN_LENGTH = RESISTOR.LENGTH + GRID_SIZE;

const BaseResistorModel = BaseData.Resistor;

const Resistor = ({
    connectors,
    color: propColor,
    theme
  }) => {

  const [wireEnd1, wireEnd2] = connectors,

        n = diff(wireEnd1, wireEnd2).normalize().multiply(RESISTOR.LENGTH / 2),
        mid = midPoint(wireEnd1, wireEnd2),
        compEnd1 = mid.add(n),
        compEnd2 = mid.subtract(n),

        rectPath = getRectPathBetween(compEnd1, compEnd2, RESISTOR.WIDTH),

        color = propColor || theme.COLORS.base;

  return (
    <Group>
      <Shape
        fill={DrawingUtils.Colors.transparent}
        stroke={color}
        strokeWidth={LINE_WIDTH}
        d={rectPath}
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

Resistor.propTypes = {
  id: React.PropTypes.string.isRequired,

  resistance: React.PropTypes.number,
  voltages: React.PropTypes.arrayOf(React.PropTypes.number),
  connectors: React.PropTypes.arrayOf(PropTypes.Vector).isRequired,

  color: React.PropTypes.string,
  theme: React.PropTypes.object.isRequired
};

Resistor.dragPoint = getDragFunctionFor(MIN_LENGTH);
Resistor.getConnectorPositions = get2ConnectorsFromDragPoints;

Resistor.typeID = BaseResistorModel.typeID;

Resistor.getBoundingBox = get2PointBoundingBox(BOUNDING_BOX_WIDTH);
Resistor.getCurrentPaths = ({
    resistance = BaseResistorModel.resistance,
    voltages = [0, 0],
    connectors,
    currentOffset,
    theme
  }) => {
  const current = (voltages[0] - voltages[1]) / resistance;
  return (
    <CurrentPath
      connectors={connectors}
      current={current}
      currentOffset={currentOffset}
      theme={theme}
    />
  );
};

export default Resistor;
