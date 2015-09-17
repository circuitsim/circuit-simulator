import React from 'react';
import { Group } from 'react-art';
import DragPoint from './DragPoint.js';
import DrawingUtils from '../utils/DrawingUtils.js';
import { getDisplayName } from './Utils.js';

const { PropTypes } = DrawingUtils;

export default CircuitComponent => {
  class DragPoints extends React.Component {
    render() {
      const { hovered, hoveredDragPointIndex, dragPoints, theme } = this.props;
      let dragPointViews = null;
      if (hovered) {
        dragPointViews = dragPoints.map((dragPoint, i) => {

          return (
            <DragPoint
              position={dragPoint}
              hovered={hoveredDragPointIndex === i}
              theme={theme}
              key={i}
            />
          );
        });
      }
      return (
        <Group>
          {dragPointViews}
        </Group>
      );
    }
  }

  DragPoints.propTypes = {
    dragPoints: React.PropTypes.arrayOf(PropTypes.Vector).isRequired,
    theme: React.PropTypes.object.isRequired,
    hovered: React.PropTypes.bool,
    hoveredDragPointIndex: React.PropTypes.oneOfType([ // index of connector being hovered
      React.PropTypes.number,
      React.PropTypes.bool
    ])
  };

  DragPoints.defaultProps = {
    hovered: false
  };

  DragPoints.displayName = `DragPointsFor(${getDisplayName(CircuitComponent)})`;

  return DragPoints;
};
