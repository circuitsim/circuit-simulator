import {
  MOVING_START,
  MOVING_FINISH
} from '../actions';

export default function moveComponentReducer(movingComponent = {}, action) {
  switch (action.type) {
  case MOVING_START: {
    const { component, mouseVector } = action;
    return {
      id: component.id,
      from: mouseVector,
      origDragPoints: component.dragPoints,
      dragPointIndex: component.dragPointIndex
    };
  }

  case MOVING_FINISH: {
    return {};
  }

  default:
    return movingComponent;
  }
}
