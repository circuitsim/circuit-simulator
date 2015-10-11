import React from 'react';
import { Group, Text, Transform } from 'react-art';
import Vector from 'immutable-vector2d';

import DrawingUtils from '../utils/DrawingUtils.js';
import { getDisplayName } from './Utils.js';

const { PropTypes, midPoint, direction } = DrawingUtils;

const FONT_SIZE = 10;
const FONT = `${FONT_SIZE}px "Arial"`;
const CONTEXT = document.createElement('canvas').getContext('2d');
CONTEXT.font = FONT;

export default CircuitComponent => {
  if (!CircuitComponent.defaultValue) {
    return CircuitComponent;
  }

  const ShowValue = props => {
    const { theme, dragPoints, value = CircuitComponent.defaultValue } = props;

    const valueString = value + CircuitComponent.unit;

    const mid = midPoint(...dragPoints),
          dir = direction(...dragPoints),
          offsetDir = dir.perpendicular().invert(),
          offsetAngle = dir.angle(),
          offsetLength = CircuitComponent.width / 2,

          textWidth = CONTEXT.measureText(valueString).width,

          extraX = Math.sin(offsetAngle) * (textWidth / 2),
          extraY = -Math.cos(offsetAngle) * (FONT_SIZE / 2),

          offset = offsetDir.multiply(offsetLength).add(new Vector(extraX, extraY)),

          textPos = mid.add(offset),
          t = new Transform().moveTo(textPos.x, textPos.y - FONT_SIZE / 2);

    return (
      <Group>
        <CircuitComponent
          {...props}
        />
        <Text transform={t} fill={theme.COLORS.base} font={FONT} alignment='middle' >
          {valueString}
        </Text>
      </Group>
    );
  };

  ShowValue.propTypes = {
    value: React.PropTypes.any,
    connectors: React.PropTypes.arrayOf(PropTypes.Vector).isRequired,
    theme: React.PropTypes.object.isRequired
  };

  ShowValue.displayName = `ShowValueFor(${getDisplayName(CircuitComponent)})`;

  return ShowValue;
};
