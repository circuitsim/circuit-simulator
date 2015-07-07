import React from 'react';
import {Shape} from 'react-art';
import {BaseData} from 'circuit-models';

import Colors from '../../styles/Colors.js';

import BoundingBox from '../BoundingBox.jsx';
import CurrentPath from '../CurrentPath.jsx';

import {drawLine, PropTypes, get2PointConnectorPositionsFor} from '../utils/DrawingUtils.js';
import {LINE_WIDTH, BOUNDING_BOX_PADDING, GRID_SIZE} from '../../utils/Constants.js';

const BOUNDING_BOX_WIDTH = LINE_WIDTH + BOUNDING_BOX_PADDING * 2;
const MIN_LENGTH = GRID_SIZE;

const {Wire: WireModel} = BaseData;

export default class Wire extends React.Component {

  render() {
    const [end1, end2] = this.props.connectors,
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
        <CurrentPath
          connectors={this.props.connectors}
        />
      </BoundingBox>
    );
  }
}

Wire.propTypes = {
  connectors: React.PropTypes.arrayOf(PropTypes.Vector).isRequired,
  color: React.PropTypes.string,
  handlers: React.PropTypes.shape({
    mouseOver: PropTypes.ArtListener,
    mouseOut: PropTypes.ArtListener
  }),
  id: React.PropTypes.string.isRequired
};

Wire.defaultProps = {
  color: Colors.base
};

Wire.getConnectorPositions = get2PointConnectorPositionsFor(MIN_LENGTH);

Wire.model = WireModel;
