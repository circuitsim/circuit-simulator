import React from 'react';
import {Path} from 'react-art';
import Vector from 'immutable-vector2d';
import evPos from 'ev-pos';

const utils = {

  midPoint(p1: Vector, p2: Vector): Vector {
    return p1.mix(p2);
  },

  diff(p1: Vector, p2: Vector): Vector {
    return p1.subtract(p2);
  },

  direction(p1: Vector, p2: Vector): Vector {
    return p2.subtract(p1);
  },

  distance(p1: Vector, p2: Vector): Vector {
    return p1.subtract(p2);
  },

  relMouseCoords(event, node) {
    return evPos(event.nativeEvent || event, node);
  },

  makeArtListener: function(f) {
    return {
      handleEvent: f
    };
  },

  getRectPointsBetween(p1: Vector, p2: Vector, width: number) {
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

    return cs;
  },

  getRectPathBetween(p1: Vector, p2: Vector, width: number) {
    const cs = utils.getRectPointsBetween(p1, p2, width);
    return new Path()
        .moveTo(cs[0].x, cs[0].y)
        .lineTo(cs[1].x, cs[1].y)
        .lineTo(cs[2].x, cs[2].y)
        .lineTo(cs[3].x, cs[3].y)
        .close();
  },

  drawLine(p1: Vector, p2: Vector) {
    return new Path()
        .moveTo(p1.x, p1.y)
        .lineTo(p2.x, p2.y)
        .close();
  },

  drawCenteredCircle(p: Vector, radius: number) {
    const offset = {
      x: radius,
      y: 0
    };
    const [p1, p2] = [p.subtract(offset), p.add(offset)];
    return utils.drawCircle(p1, p2);
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
    ArtListener: React.PropTypes.shape({
      handleEvent: React.PropTypes.func.isRequired
    }),
    Vector: React.PropTypes.shape({
      x: React.PropTypes.number.isRequired,
      y: React.PropTypes.number.isRequired
    })
  },

  Colors: {
    transparent: 'rgba(0,0,0,0)'
  }
};

export default utils;
