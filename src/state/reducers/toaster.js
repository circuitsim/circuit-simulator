import {
  SHOW_ADD_TOASTER,
  HIDE_ADD_TOASTER
} from '../actions';

export default function toasterReducer(showToaster = false, action) {
  switch (action.type) {
  case SHOW_ADD_TOASTER:
    return true;

  case HIDE_ADD_TOASTER:
    return false;

  default:
    return showToaster;
  }
}
