import React from 'react';
import { Group } from 'react-art';
import R from 'ramda';

import { BaseData } from './models/AllModels.js';
import DrawingUtils from '../../utils/DrawingUtils.js';
import Line from '../../utils/Line.js';
import CurrentPath from '../CurrentPath.js';
import { get2PointBoundingBox } from '../boundingBox.js';

import { getDragFunctionFor, getConnectorFromFirstDragPoint } from '../Utils.js';
import { GRID_SIZE } from '../Constants.js';
import { LINE_WIDTH } from '../../Constants.js';

const { PropTypes, direction } = DrawingUtils;

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

const Ground = ({
    // voltages = [0, 0],
    currents = [0],
    // connectors,
    dragPoints,
    color: propColor,
    theme
  }) => {
  const color = propColor || theme.COLORS.base,

        [connector, end] = dragPoints,
        dir = direction(connector, end),
        perpDir = dir.perpendicular(),
        wire = dir.normalize(WIRE_LENTH),
        // T represents the shape where the wire meets the ground lines
        positionOfT = connector.add(wire),
        lines = R.map(i => {
          const offsetFromTLength: number = i * (GAP_SIZE + LINE_WIDTH),
                offsetFromEndLength: number = GROUND_LENGTH - offsetFromTLength,
                offsetFromT = dir.normalize(offsetFromTLength),
                centerOfLine = positionOfT.add(offsetFromT),
                lineLength: number = offsetFromEndLength / SINE_SIXTY,
                halfLine = perpDir.normalize(lineLength / 2),
                endPoints = [
                  centerOfLine.add(halfLine),
                  centerOfLine.subtract(halfLine)
                ];
          return (
            <Line
              key={i}
              color={color}
              points={endPoints}
              width={LINE_WIDTH}
            />
          );
        }, R.range(0, NUM_OF_LINES));
  return (
    <Group>
      <Line
        color={color}
        points={[connector, positionOfT]}
        width={LINE_WIDTH}
      />
      {lines}
      <CurrentPath
        connectors={[positionOfT, connector]}
        current={currents[0]}
        theme={theme}
      />
    </Group>
  );
};

Ground.propTypes = {
  id: React.PropTypes.string.isRequired,

  voltages: React.PropTypes.arrayOf(React.PropTypes.number),
  currents: React.PropTypes.arrayOf(React.PropTypes.number),
  // connectors: PropTypes.Vector.isRequired,
  dragPoints: React.PropTypes.arrayOf(PropTypes.Vector).isRequired,

  color: React.PropTypes.string,
  theme: React.PropTypes.object.isRequired
};

Ground.dragPoint = getDragFunctionFor(MIN_LENGTH, MAX_LENGTH);
Ground.getConnectorPositions = getConnectorFromFirstDragPoint;

Ground.typeID = Model.typeID;

Ground.getBoundingBox = get2PointBoundingBox(GROUND_LENGTH);

export default Ground;
