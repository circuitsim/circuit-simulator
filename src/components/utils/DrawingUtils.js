import React from 'react';
import {Path} from 'react-art';

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

  drawRectBetweenTwoPoints(p1, p2, width) {
    const v = { // vector
      x: p2.x - p1.x,
      y: p2.y - p1.y
    };
    const p = { // perpendicular
      x: v.y,
      y: -v.x
    };
    const l = Math.sqrt((v.x * v.x) + (v.y * v.y)); // length
    const r = (width / l) / 2;
    const np = { // normalised perpendicular
      x: p.x * r,
      y: p.y * r
    };

    const cs = [ // corners
      {x: p1.x + np.x, y: p1.y + np.y},
      {x: p1.x - np.x, y: p1.y - np.y},
      {x: p2.x - np.x, y: p2.y - np.y},
      {x: p2.x + np.x, y: p2.y + np.y} // just here for completeness...
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
