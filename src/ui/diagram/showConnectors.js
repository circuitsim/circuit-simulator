import React from 'react';
import { Group } from 'react-art';
import Connector from './Connector.js';
import DrawingUtils from '../utils/DrawingUtils.js';
import { getDisplayName } from './Utils.js';

const { PropTypes } = DrawingUtils;

export default CircuitComponent => {
  class Connectors extends React.Component {
    render() {
      let connectors = null;
      if (this.props.hover) {
        connectors = this.props.connectors.map((connector, i) => {
          return (
            <Connector
              position={connector}
              color={this.props.theme.COLORS.transBase}
              key={i}
            />
          );
        });
      }
      return (
        <Group>
          <CircuitComponent {...this.props} />
          {connectors}
        </Group>
      );
    }
  }

  Connectors.propTypes = {
    connectors: React.PropTypes.arrayOf(PropTypes.Vector).isRequired,
    theme: React.PropTypes.object.isRequired,
    hover: React.PropTypes.bool
  };

  Connectors.defaultProps = {
    hover: false
  };

  Connectors.displayName = `ConnectorsFor(${getDisplayName(CircuitComponent)})`;

  return Connectors;
};
