import React from 'react';
import { Group } from 'react-art';
import DrawingUtils from '../utils/DrawingUtils.js';
import Circle from '../utils/Circle.js';
import { getDisplayName } from './Utils.js';
import { LINE_WIDTH } from '../Constants.js';

const { PropTypes } = DrawingUtils;

export default CircuitComponent => {
  const Connectors = props => {
    const { connectors, theme } = props,
          connectorDots = connectors.map((connector, i) => {
            return (
              <Circle
                lineColor={theme.COLORS.base}
                fillColor={theme.COLORS.base}
                lineWidth={LINE_WIDTH}
                position={{
                  center: connector,
                  radius: LINE_WIDTH
                }}
                key={i}
              />
            );
          });
    return (
      <Group>
        <CircuitComponent
          {...props}
        />
        {connectorDots}
      </Group>
    );
  };

  Connectors.propTypes = {
    connectors: React.PropTypes.arrayOf(PropTypes.Vector).isRequired,
    theme: React.PropTypes.object.isRequired
  };

  Connectors.displayName = `ConnectorsFor(${getDisplayName(CircuitComponent)})`;

  return Connectors;
};
