type Vec2Vec = (v: Vector) => Vector;

declare type Coordinate = {
  x: number;
  y: number;
};

declare type Vector = {
  x: number;
  y: number;

  normalize: () => Vector;
  length: () => number;

  subtract: Vec2Vec;
};

declare module 'immutable-vector2d' {
  declare function exports(): Vector;
  declare function fromObject(obj: Coordinate): Vector;
}
