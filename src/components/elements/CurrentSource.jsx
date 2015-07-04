import React from 'react';
import {Shape} from 'react-art';

import Colors from '../../styles/Colors.js';

import BoundingBox from '../BoundingBox.jsx';
import CurrentPath from '../CurrentPath.jsx';

import {drawLine, drawCircle, PropTypes, midPoint, diff, get2PointConnectorPositionsFor} from '../utils/DrawingUtils.js';
import {LINE_WIDTH, BOUNDING_BOX_PADDING, CURRENT_SOURCE, GRID_SIZE} from '../../utils/Constants.js';

const BOUNDING_BOX_WIDTH = CURRENT_SOURCE.RADIUS * 2 + BOUNDING_BOX_PADDING * 2;

const MIN_LENGTH = CURRENT_SOURCE.RADIUS * 3 + GRID_SIZE;

export default class CurrentSource extends React.Component {

  render() {
    const [wireEnd1, wireEnd2] = this.props.connectors,

          mid = midPoint(wireEnd1, wireEnd2),
          n = diff(wireEnd1, wireEnd2).normalize(),

          compOffset = n.multiply(CURRENT_SOURCE.RADIUS * 1.5),
          circleOffset = n.multiply(CURRENT_SOURCE.RADIUS / 2),

          compEnd1 = mid.add(compOffset),
          compEnd2 = mid.subtract(compOffset),

          wirePath1 = drawLine(wireEnd1, compEnd1, LINE_WIDTH),
          wirePath2 = drawLine(wireEnd2, compEnd2, LINE_WIDTH),

          circlePath1 = drawCircle(compEnd1, mid.subtract(circleOffset)),
          circlePath2 = drawCircle(mid.add(circleOffset), compEnd2);

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
          d={circlePath1}
        />
        <Shape
          fill={Colors.transparent}
          stroke={this.props.color}
          strokeWidth={LINE_WIDTH}
          d={circlePath2}
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
        />
      </BoundingBox>
    );
  }
}

CurrentSource.propTypes = {
  connectors: React.PropTypes.arrayOf(PropTypes.Vector).isRequired,
  color: React.PropTypes.string,
  handlers: React.PropTypes.shape({
    mouseOver: PropTypes.ArtListener,
    mouseOut: PropTypes.ArtListener
  }),
  id: React.PropTypes.string.isRequired
};

CurrentSource.defaultProps = {
  color: Colors.base
};

CurrentSource.getConnectorPositions = get2PointConnectorPositionsFor(MIN_LENGTH);
