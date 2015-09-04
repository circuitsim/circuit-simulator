import React from 'react';
import { BaseData } from './models/Models.js';
import { Utils as DrawingUtils, Line } from 'circuitsim-art-utils';

import BoundingBox from '../BoundingBox.js';
import CurrentPath from '../CurrentPath.js';

import { get2PointConnectorPositionsFor } from '../Utils.js';
import { BOUNDING_BOX_PADDING, GRID_SIZE } from '../Constants.js';

const { PropTypes } = DrawingUtils;

const MIN_LENGTH = GRID_SIZE;

const BaseWireModel = BaseData.Wire;

export default class Wire extends React.Component {

  render() {
    const { LINE_WIDTH } = this.props.theme.ART,
          BOUNDING_BOX_WIDTH = LINE_WIDTH + BOUNDING_BOX_PADDING * 2,

          [end1, end2] = this.props.connectors,
          color = this.props.color || this.props.theme.COLORS.base;

    return (
      <BoundingBox
        from={end1}
        to={end2}
        width={BOUNDING_BOX_WIDTH}
        onMouseOver={this.props.onMouseOver}
        onMouseOut={this.props.onMouseOut}
      >
        <Line
          color={color}
          points={this.props.connectors}
          width={LINE_WIDTH}
        />
        <CurrentPath
          connectors={this.props.connectors}
          current={this.props.currents[0]}
          theme={this.props.theme}
        />
      </BoundingBox>
    );
  }
}

Wire.propTypes = {
  id: React.PropTypes.string.isRequired,

  voltages: React.PropTypes.arrayOf(React.PropTypes.number),
  currents: React.PropTypes.arrayOf(React.PropTypes.number),
  connectors: React.PropTypes.arrayOf(PropTypes.Vector).isRequired,

  color: React.PropTypes.string,
  theme: React.PropTypes.object.isRequired,

  onMouseOver: PropTypes.ArtListener,
  onMouseOut: PropTypes.ArtListener
};

Wire.defaultProps = {
  voltages: [0, 0],
  currents: [0]
};

Wire.getConnectorPositions = get2PointConnectorPositionsFor(MIN_LENGTH);

Wire.model = BaseWireModel;
