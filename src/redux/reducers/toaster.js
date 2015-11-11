import R from 'ramda';

import {
  SHOW_ADD_TOASTER,
  HIDE_ADD_TOASTER
} from '../actions.js';

export default function toasterReducer(state, action) {
  switch (action.type) {
  case SHOW_ADD_TOASTER:
    if (R.isEmpty(state.views)) {
      return R.assoc('showAddToaster', true, state);
    }
    return state;

  case HIDE_ADD_TOASTER:
    return R.assoc('showAddToaster', false, state);

  default:
    return state;
  }
}
