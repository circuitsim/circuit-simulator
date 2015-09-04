import React from 'react';
import { Shape } from 'react-art';
import { BaseData } from './models/Models.js';
import { Utils as DrawingUtils, Line } from 'circuitsim-art-utils';

import BoundingBox from '../BoundingBox.js';
import CurrentPath from '../CurrentPath.js';

import { get2PointConnectorPositionsFor } from '../Utils.js';
import { BOUNDING_BOX_PADDING, RESISTOR, GRID_SIZE } from '../Constants.js';

const { drawRectBetweenTwoPoints, PropTypes, midPoint, diff } = DrawingUtils;

const BOUNDING_BOX_WIDTH = RESISTOR.WIDTH + BOUNDING_BOX_PADDING * 2;
const MIN_LENGTH = RESISTOR.LENGTH + GRID_SIZE;

const BaseResistorModel = BaseData.Resistor;

export default class Resistor extends React.Component {

  render() {
    const {LINE_WIDTH} = this.props.theme.ART,

          [wireEnd1, wireEnd2] = this.props.connectors,

          n = diff(wireEnd1, wireEnd2).normalize().multiply(RESISTOR.LENGTH / 2),
          mid = midPoint(wireEnd1, wireEnd2),
          compEnd1 = mid.add(n),
          compEnd2 = mid.subtract(n),

          rectPath = drawRectBetweenTwoPoints(compEnd1, compEnd2, RESISTOR.WIDTH),

          voltages = this.props.voltages,
          current = (voltages[0] - voltages[1]) / this.props.resistance,

          color = this.props.color || this.props.theme.COLORS.base;

    return (
      <BoundingBox
        from={wireEnd1}
        to={wireEnd2}
        width={BOUNDING_BOX_WIDTH}
        onMouseOver={this.props.onMouseOver}
        onMouseOut={this.props.onMouseOut}
      >
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
        <CurrentPath
          connectors={this.props.connectors}
          current={current}
          theme={this.props.theme}
        />
      </BoundingBox>
    );
  }
}

Resistor.propTypes = {
  id: React.PropTypes.string.isRequired,

  resistance: React.PropTypes.number,
  voltages: React.PropTypes.arrayOf(React.PropTypes.number),
  connectors: React.PropTypes.arrayOf(PropTypes.Vector).isRequired,

  color: React.PropTypes.string,
  theme: React.PropTypes.object.isRequired,

  onMouseOver: PropTypes.ArtListener,
  onMouseOut: PropTypes.ArtListener
};

Resistor.defaultProps = {
  resistance: BaseResistorModel.resistance,
  voltages: [0, 0]
};

Resistor.getConnectorPositions = get2PointConnectorPositionsFor(MIN_LENGTH);

Resistor.model = BaseResistorModel;
