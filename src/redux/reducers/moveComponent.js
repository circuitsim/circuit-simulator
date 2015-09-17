import R from 'ramda';
import {
  MOVING_START,
  // MOVING_MOVE,
  MOVING_FINISH
} from '../actions.js';

export default function addingComponentReducer(state, action) {
  switch (action.type) {
  case MOVING_START: {
    const { hover: { viewID, dragPointIndex } } = state;
    return R.assoc('movingComponent', {
      id: viewID,
      from: action.coords,
      dragPointIndex
    }, state);
  }

  // case MOVING_MOVE: {
  //   const { hover: { id, from, dragPointIndex } } = state;
  //   if (dragPointIndex) { // moving a single dragPoint
  //
  //   } else { // moving a whole component
  //   }
  // }

  case MOVING_FINISH: {
    return R.assoc('movingComponent', {}, state);
  }

  default:
    return state;
  }
}
