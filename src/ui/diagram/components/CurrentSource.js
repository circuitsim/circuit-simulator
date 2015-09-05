import React from 'react';
import { Shape } from 'react-art';
import { BaseData } from './models/Models.js';
import DrawingUtils from '../../utils/DrawingUtils.js';
import Line from '../../utils/Line.js';
import Circle from '../../utils/Circle.js';

import BoundingBox from '../BoundingBox.js';
import CurrentPath from '../CurrentPath.js';

import { get2PointConnectorPositionsFor } from '../Utils.js';
import { BOUNDING_BOX_PADDING, CURRENT_SOURCE, GRID_SIZE } from '../Constants.js';

const { drawCircle, PropTypes, midPoint, diff } = DrawingUtils;

const BOUNDING_BOX_WIDTH = CURRENT_SOURCE.RADIUS * 2 + BOUNDING_BOX_PADDING * 2;
const MIN_LENGTH = CURRENT_SOURCE.RADIUS * 3 + GRID_SIZE;

const BaseCurrentSourceModel = BaseData.CurrentSource;

export default class CurrentSource extends React.Component {

  render() {
    const {LINE_WIDTH} = this.props.theme.ART,

          [wireEnd1, wireEnd2] = this.props.connectors,

          mid = midPoint(wireEnd1, wireEnd2),
          n = diff(wireEnd1, wireEnd2).normalize(),

          compOffset = n.multiply(CURRENT_SOURCE.RADIUS * 1.5),
          circleOffset = n.multiply(CURRENT_SOURCE.RADIUS / 2),

          compEnd1 = mid.add(compOffset),
          compEnd2 = mid.subtract(compOffset),

          circlePoints1 = [compEnd1, mid.subtract(circleOffset)],
          circlePoints2 = [mid.add(circleOffset), compEnd2],

          error = this.context
                  && this.context.animContext
                  && this.context.animContext.circuitError, // :( this makes me sad

          current = error ? 0 : this.props.current,

          color = this.props.color || this.props.theme.COLORS.base;

    return (
      <BoundingBox
        from={wireEnd1}
        to={wireEnd2}
        width={BOUNDING_BOX_WIDTH}
        onMouseOver={this.props.onMouseOver}
        onMouseOut={this.props.onMouseOut}
      >
        <Circle
          lineColor={color}
          lineWidth={LINE_WIDTH}
          position={{
            points: circlePoints1
          }}
        />
        <Circle
          lineColor={color}
          lineWidth={LINE_WIDTH}
          position={{
            points: circlePoints2
          }}
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

CurrentSource.propTypes = {
  id: React.PropTypes.string.isRequired,

  current: React.PropTypes.number,
  voltages: React.PropTypes.arrayOf(React.PropTypes.number),
  connectors: React.PropTypes.arrayOf(PropTypes.Vector).isRequired,

  color: React.PropTypes.string,
  theme: React.PropTypes.object.isRequired,

  onMouseOver: PropTypes.ArtListener,
  onMouseOut: PropTypes.ArtListener
};

CurrentSource.defaultProps = {
  current: BaseCurrentSourceModel.current,
  voltages: [0, 0]
};

CurrentSource.contextTypes = {
  animContext: React.PropTypes.shape({
    circuitError: React.PropTypes.any
  })
};

CurrentSource.getConnectorPositions = get2PointConnectorPositionsFor(MIN_LENGTH);

CurrentSource.model = BaseCurrentSourceModel;
