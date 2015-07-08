import React from 'react';
import {Shape} from 'react-art';
import {BaseData} from 'circuit-models';

import Colors from '../../styles/Colors.js';

import BoundingBox from '../BoundingBox.jsx';
import CurrentPath from '../CurrentPath.jsx';

import {drawRectBetweenTwoPoints, drawLine, PropTypes, midPoint, diff, get2PointConnectorPositionsFor} from '../utils/DrawingUtils.js';
import {LINE_WIDTH, BOUNDING_BOX_PADDING, RESISTOR, GRID_SIZE} from '../../utils/Constants.js';

const BOUNDING_BOX_WIDTH = RESISTOR.WIDTH + BOUNDING_BOX_PADDING * 2;
const MIN_LENGTH = RESISTOR.LENGTH + GRID_SIZE;

const {Resistor: BaseResistorModel} = BaseData;

export default class Resistor extends React.Component {

  render() {
    const [wireEnd1, wireEnd2] = this.props.connectors,

          n = diff(wireEnd1, wireEnd2).normalize().multiply(RESISTOR.LENGTH / 2),
          mid = midPoint(wireEnd1, wireEnd2),
          compEnd1 = mid.add(n),
          compEnd2 = mid.subtract(n),

          wirePath1 = drawLine(wireEnd1, compEnd1, LINE_WIDTH),
          wirePath2 = drawLine(wireEnd2, compEnd2, LINE_WIDTH),
          rectPath = drawRectBetweenTwoPoints(compEnd1, compEnd2, RESISTOR.WIDTH),

          voltages = this.props.voltages,
          current = (voltages[0] - voltages[1]) / this.props.resistance;

    return (
      <BoundingBox
        from={wireEnd1}
        to={wireEnd2}
        width={BOUNDING_BOX_WIDTH}
        handlers={this.props.handlers}
      >
        <Shape
          fill={Colors.transparent}
          stroke={this.props.color}
          strokeWidth={LINE_WIDTH}
          d={rectPath}
        />
        <Shape
          fill={this.props.color}
          d={wirePath1}
        />
        <Shape
          fill={this.props.color}
          d={wirePath2}
        />
        <CurrentPath
          connectors={this.props.connectors}
          current={current}
        />
      </BoundingBox>
    );
  }
}

Resistor.propTypes = {
  resistance: React.PropTypes.number,
  voltages: React.PropTypes.arrayOf(React.PropTypes.number),
  connectors: React.PropTypes.arrayOf(PropTypes.Vector).isRequired,
  color: React.PropTypes.string,
  handlers: React.PropTypes.shape({
    mouseOver: PropTypes.ArtListener,
    mouseOut: PropTypes.ArtListener
  }),
  id: React.PropTypes.string.isRequired
};

Resistor.defaultProps = {
  resistance: BaseResistorModel.get('resistance'),
  voltages: [0, 0],
  color: Colors.base
};

Resistor.getConnectorPositions = get2PointConnectorPositionsFor(MIN_LENGTH);

Resistor.model = BaseResistorModel;
