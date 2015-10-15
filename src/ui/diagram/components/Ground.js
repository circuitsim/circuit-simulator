import React from 'react';
import { Group } from 'react-art';
import R from 'ramda';

import { BaseData } from './models';
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

const getShapeAttributes = dragPoints => {
  const [connector, end] = dragPoints,
        dir = direction(connector, end),
        perpDir = dir.perpendicular(),
        wire = dir.normalize(WIRE_LENTH),
        // T represents the shape where the wire meets the ground lines
        positionOfT = connector.add(wire);
  return {
    dir,
    perpDir,
    positionOfT
  };
};

const Ground = ({
    dragPoints,
    colors
  }) => {
  const [connector] = dragPoints,
        { dir, perpDir, positionOfT } = getShapeAttributes(dragPoints),
        groundLines = R.map(i => {
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
              color={colors[0]}
              points={endPoints}
              width={LINE_WIDTH}
            />
          );
        }, R.range(0, NUM_OF_LINES));
  return (
    <Group>
      <Line
        color={colors[0]}
        points={[connector, positionOfT]}
        width={LINE_WIDTH}
      />
      {groundLines}
    </Group>
  );
};

Ground.propTypes = {
  dragPoints: React.PropTypes.arrayOf(PropTypes.Vector).isRequired,
  colors: React.PropTypes.arrayOf(React.PropTypes.string)
};

Ground.numOfVoltages = 2; // including implicit ground (always 0V)
Ground.numOfConnectors = 1;
Ground.dragPoint = getDragFunctionFor(MIN_LENGTH, MAX_LENGTH);
Ground.getConnectorPositions = getConnectorFromFirstDragPoint;

Ground.typeID = Model.typeID;

Ground.getBoundingBox = get2PointBoundingBox(GROUND_LENGTH);
Ground.getCurrentPaths = ({
    dragPoints,
    currents = [0],
    currentOffset
  }) => {
  const [connector] = dragPoints,
        { positionOfT } = getShapeAttributes(dragPoints);
  return (
    <CurrentPath
      /* current goes in opposite direction of drag */
      connectors={[positionOfT, connector]}
      current={currents[0]}
      currentOffset={currentOffset}
    />
  );
};

export default Ground;
