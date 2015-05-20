import React from 'react';
import {Path} from 'react-art';

import Vector from 'immutable-vector2d';
import {LINE_WIDTH} from './Constants.js';

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

  PropTypes: {
    Vector: React.PropTypes.instanceOf(Vector)
  }
};

export default utils;
