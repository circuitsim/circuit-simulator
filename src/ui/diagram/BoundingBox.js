import React from 'react';
import {Shape, Group} from 'react-art';
import { Utils } from 'circuitsim-art-utils';

/**
 * A bounding box is a transparent box used to detect mouse events near a component.
 */
export default class BoundingBox extends React.Component {

  render() {
    const end1 = this.props.from,
          end2 = this.props.to,
          boundingBoxPath = Utils.drawRectBetweenTwoPoints(end1, end2, this.props.width);

    return (
      <Group>
        {this.props.children}
        <Shape // at the bottom to properly detect mouse events
          onMouseOver={this.props.onMouseOver}
          onMouseOut={this.props.onMouseOut}
          fill={Utils.Colors.transparent}
          d={boundingBoxPath}
        />
      </Group>
    );
  }
}

BoundingBox.propTypes = {
  from: Utils.PropTypes.Vector,
  to: Utils.PropTypes.Vector,
  width: React.PropTypes.number.isRequired,

  onMouseOver: Utils.PropTypes.ArtListener,
  onMouseOut: Utils.PropTypes.ArtListener
};

function noop () {
}

BoundingBox.defaultProps = {
  mouseOver: noop,
  mouseOut: noop
};
