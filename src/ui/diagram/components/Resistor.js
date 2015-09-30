import React from 'react';
import { Group } from 'react-art';
import R from 'ramda';
import Vector from 'immutable-vector2d';

import { BaseData } from './models/AllModels.js';
import DrawingUtils from '../../utils/DrawingUtils.js';
import Line from '../../utils/Line.js';
import GradientLine from '../../utils/GradientLine.js';
import CurrentPath from '../CurrentPath.js';
import { get2PointBoundingBox } from '../boundingBox.js';

import { getDragFunctionFor, get2ConnectorsFromDragPoints } from '../Utils.js';
import { BOUNDING_BOX_PADDING, RESISTOR, GRID_SIZE } from '../Constants.js';
import { LINE_WIDTH } from '../../Constants.js';

const { getRectPointsBetween, PropTypes, midPoint, direction } = DrawingUtils;

const BOUNDING_BOX_WIDTH = RESISTOR.WIDTH + BOUNDING_BOX_PADDING * 2;
const MIN_LENGTH = RESISTOR.LENGTH + GRID_SIZE;

const BaseResistorModel = BaseData.Resistor;

const Resistor = ({
    connectors,
    color: propColor,
    theme,
    volts2RGB,
    voltages
  }) => {

  const [wireEnd1, wireEnd2] = connectors,

        n = direction(wireEnd1, wireEnd2).normalize().multiply(RESISTOR.LENGTH / 2),
        mid = midPoint(wireEnd1, wireEnd2),
        compEnd1 = mid.subtract(n),
        compEnd2 = mid.add(n),

        points = R.map(Vector.fromObject, getRectPointsBetween(compEnd1, compEnd2, RESISTOR.WIDTH)),

        vColor1 = propColor ? propColor : volts2RGB(theme.COLORS)(voltages[0]),
        vColor2 = propColor ? propColor : volts2RGB(theme.COLORS)(voltages[1]);

  return (
    <Group>
      <Line
        points={[points[0], points[1]]}
        width={LINE_WIDTH}
        color={vColor1}
      />
      <GradientLine
        points={[points[1], points[2]]}
        width={LINE_WIDTH}
        colors={[vColor1, vColor2]}
      />
      <GradientLine
        points={[points[0], points[3]]}
        width={LINE_WIDTH}
        colors={[vColor1, vColor2]}
      />
      <Line
        points={[points[2], points[3]]}
        width={LINE_WIDTH}
        color={vColor2}
      />

      {/* wires */}
      <Line
        color={vColor1}
        points={[wireEnd1, compEnd1]}
        width={LINE_WIDTH}
      />
      <Line
        color={vColor2}
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
