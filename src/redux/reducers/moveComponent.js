import {
  MOVING_START,
  MOVING_FINISH
} from '../actions.js';

export default function moveComponentReducer(movingComponent = {}, action) {
  switch (action.type) {
  case MOVING_START: {
    const { component, dragPointIndex, mouseVector } = action;
    return {
      id: component.id,
      from: mouseVector,
      origDragPoints: component.dragPoints,
      dragPointIndex
    };
  }

  case MOVING_FINISH: {
    return {};
  }

  default:
    return movingComponent;
  }
}
