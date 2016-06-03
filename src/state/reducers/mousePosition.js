import Vector from 'immutable-vector2d';

import {
  MOUSE_MOVED
} from '../actions';

const ZERO_VECTOR = new Vector(0, 0);

export default function selectComponentReducer(mousePos = ZERO_VECTOR, action) {
  switch (action.type) {
  case MOUSE_MOVED: {
    return Vector.fromObject(action.coords);
  }
  default:
    return mousePos;
  }
}
