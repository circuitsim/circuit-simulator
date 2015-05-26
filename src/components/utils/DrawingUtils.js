import React from 'react';
import {Path} from 'react-art';

import Vector from 'immutable-vector2d';
import {LINE_WIDTH, GRID_SIZE} from './Constants.js';

const utils = {
  // credit to: https://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
  relMouseCoords(event, node) {
    node = React.findDOMNode(node) || node;
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var x = 0;
    var y = 0;

    do {
      totalOffsetX += node.offsetLeft - node.scrollLeft;
      totalOffsetY += node.offsetTop - node.scrollTop;
      node = node.offsetParent;
    }
    while (node);

    x = event.pageX - totalOffsetX;
    y = event.pageY - totalOffsetY;

    return {x, y};
  },

  makeArtListener: function(f) {
    return {
      handleEvent: f
    };
  },

  midPoint(p1: Vector, p2: Vector): Vector {
    return p1.mix(p2);
  },

  diff(p1: Vector, p2: Vector): Vector {
    return p1.subtract(p2);
  },

  get2PointConnectorPositionsFor(minLength: number) {
    /**
     * Given a fixed start point, and a second point being dragged,
     * return the connector coordinates for a two-connector element.
     *
     * @param  {Vector} startPoint Fixed starting coordinate
     * @param  {Vector} dragPoint  Coordinate of point being dragged
     */
    return function(startPoint: Vector, dragPoint: Vector) {
      const v = utils.diff(dragPoint, startPoint).minLength(minLength);
      return {from: startPoint, to: startPoint.add(v).snap(GRID_SIZE)};
    };
  },

  drawRectBetweenTwoPoints(p1: Vector, p2: Vector, width: number) {
    const v = utils.diff(p1, p2);
    const p = { // perpendicular
      x: v.y,
      y: -v.x
    };
    const l: number = v.length();
    const r: number = (width / l) / 2;
    const np = { // normalised perpendicular
      x: p.x * r,
      y: p.y * r
    };

    const cs = [ // corners
      {x: p1.x + np.x, y: p1.y + np.y},
      {x: p1.x - np.x, y: p1.y - np.y},
      {x: p2.x - np.x, y: p2.y - np.y},
      {x: p2.x + np.x, y: p2.y + np.y}
    ];

    return new Path()
        .moveTo(cs[0].x, cs[0].y)
        .lineTo(cs[1].x, cs[1].y)
        .lineTo(cs[2].x, cs[2].y)
        .lineTo(cs[3].x, cs[3].y)
        .close();
  },

  drawLine(p1: Vector, p2: Vector) {
    return utils.drawRectBetweenTwoPoints(p1, p2, LINE_WIDTH);
  },

  drawCircle(p1: Vector, p2: Vector) {
    const v = utils.diff(p1, p2);
    const radius = v.length() / 2;

    return new Path()
        .moveTo(p1.x, p1.y)
        .arc(-v.x, -v.y, radius, radius)
        .arc(v.x, v.y, radius, radius)
        .close();
  },

  PropTypes: {
    Vector: React.PropTypes.instanceOf(Vector),
    ArtListener: React.PropTypes.shape({
      handleEvent: React.PropTypes.func.isRequired
    })
  }
};

export default utils;
