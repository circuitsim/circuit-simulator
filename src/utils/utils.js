import React from 'react';

module.exports = {
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
  }
};
