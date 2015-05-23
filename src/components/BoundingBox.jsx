import React from 'react';
import {Shape, Group} from 'react-art';

import Colors from '../styles/Colors.js';

import {drawRectBetweenTwoPoints, PropTypes} from './utils/DrawingUtils.js';

/**
 * A bounding box is a transparent box used to detect mouse events near a component.
 */
export default class BoundingBox extends React.Component {

  render() {
    const end1 = this.props.from,
          end2 = this.props.to,
          boundingBoxPath = drawRectBetweenTwoPoints(end1, end2, this.props.width);

    return (
      <Group>
        {this.props.children}
        <Shape // at the bottom to properly detect mouse events
          onMouseOver={this.props.handlers.mouseOver}
          onMouseOut={this.props.handlers.mouseOut}
          fill={Colors.transparent}
          d={boundingBoxPath}
        />
      </Group>
    );
  }
}

BoundingBox.propTypes = {
  from: PropTypes.Vector.isRequired,
  to: PropTypes.Vector.isRequired,
  width: React.PropTypes.number.isRequired,
  handlers: React.PropTypes.shape({
    mouseOver: PropTypes.ArtListener,
    mouseOut: PropTypes.ArtListener
  })
};

function noop () {
}

BoundingBox.defaultProps = {
  mouseOver: noop,
  mouseOut: noop
};
