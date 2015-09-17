import React from 'react';
import { Group } from 'react-art';
import Connector from './Connector.js';
import DrawingUtils from '../utils/DrawingUtils.js';
import { getDisplayName } from './Utils.js';

const { PropTypes } = DrawingUtils;

export default CircuitComponent => {
  class Connectors extends React.Component {
    render() {
      const { hovered, hoveredConnectorIndex, connectors, theme } = this.props;
      let connectorViews = null;
      if (hovered) {
        connectorViews = connectors.map((connector, i) => {

          return (
            <Connector
              position={connector}
              hovered={hoveredConnectorIndex === i}
              theme={theme}
              key={i}
            />
          );
        });
      }
      return (
        <Group>
          {connectorViews}
        </Group>
      );
    }
  }

  Connectors.propTypes = {
    connectors: React.PropTypes.arrayOf(PropTypes.Vector).isRequired,
    theme: React.PropTypes.object.isRequired,
    hovered: React.PropTypes.bool,
    hoveredConnectorIndex: React.PropTypes.number // index of connector being hovered
  };

  Connectors.defaultProps = {
    hovered: false
  };

  Connectors.displayName = `ConnectorsFor(${getDisplayName(CircuitComponent)})`;

  return Connectors;
};
