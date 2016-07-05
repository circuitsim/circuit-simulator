import Vector from 'immutable-vector2d';
import evPos from 'ev-pos';

export const midPoint = (p1: Vector, p2: Vector): Vector => {
  return p1.mix(p2);
};

export const diff = (p1: Vector, p2: Vector): Vector => {
  return p1.subtract(p2);
};

export const direction = (p1: Vector, p2: Vector): Vector => {
  return p2.subtract(p1).normalize();
};

export const distance = (p1: Vector, p2: Vector): Vector => {
  return p1.subtract(p2);
};

export const relMouseCoords = (event, node) => {
  return evPos(event.nativeEvent || event, node);
};

export const getRectPointsBetween = (p1: Vector, p2: Vector, width: number) => {
  const v = diff(p1, p2);
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
};
