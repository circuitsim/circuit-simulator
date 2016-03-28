import {CHANGE_CURRENT_SPEED} from '../actions';

export default function currentSpeedReducer(speed = 50, action) {
  switch (action.type) {
  case CHANGE_CURRENT_SPEED:
    return action.speed;

  default:
    return speed;
  }
}
