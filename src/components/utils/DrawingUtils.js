import React from 'react';
import {Path} from 'react-art';

import Vector from 'immutable-vector2d';

export type Coordinate = {x: number; y: number}; // where to put this?

export default {
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

  drawRectBetweenTwoPoints(p1: Coordinate, p2: Coordinate, width: number) {
    const v1 = Vector.fromObject(p1);
    const v2 = Vector.fromObject(p2);
    const v = v2.subtract(v1);
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
      {x: v1.x + np.x, y: v1.y + np.y},
      {x: v1.x - np.x, y: v1.y - np.y},
      {x: v2.x - np.x, y: v2.y - np.y},
      {x: v2.x + np.x, y: v2.y + np.y}
    ];

    return new Path()
        .moveTo(cs[0].x, cs[0].y)
        .lineTo(cs[1].x, cs[1].y)
        .lineTo(cs[2].x, cs[2].y)
        .lineTo(cs[3].x, cs[3].y)
        .close();
  },

  PropTypes: {
    Coordinate: React.PropTypes.shape({
        x: React.PropTypes.number,
        y: React.PropTypes.number
      })
  }
};
