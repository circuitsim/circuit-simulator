import React from 'react';
import {Shape} from 'react-art';

import Colors from '../../styles/Colors.js';

import BoundingBox from '../BoundingBox.jsx';

import {drawLine, PropTypes, get2PointConnectorPositionsFor} from '../utils/DrawingUtils.js';
import {LINE_WIDTH, BOUNDING_BOX_PADDING, GRID_SIZE} from '../utils/Constants.js';

const BOUNDING_BOX_WIDTH = LINE_WIDTH + BOUNDING_BOX_PADDING * 2;

const MIN_LENGTH = GRID_SIZE;

export default class Wire extends React.Component {

  render() {
    const end1 = this.props.connectors.from,
          end2 = this.props.connectors.to,
          wirePath = drawLine(end1, end2);
    return (
      <BoundingBox
        from={end1}
        to={end2}
        width={BOUNDING_BOX_WIDTH}
        handlers={this.props.handlers}
      >
        <Shape
          fill={this.props.color}
          d={wirePath}
        />
      </BoundingBox>
    );
  }
}

Wire.propTypes = {
  connectors: React.PropTypes.shape({
    from: PropTypes.Vector.isRequired,
    to: PropTypes.Vector.isRequired
  }).isRequired,
  color: React.PropTypes.string,
  handlers: React.PropTypes.shape({
    mouseOver: PropTypes.ArtListener,
    mouseOut: PropTypes.ArtListener
  })
};

Wire.defaultProps = {
  color: Colors.base
};

Wire.getConnectorPositions = get2PointConnectorPositionsFor(MIN_LENGTH);
