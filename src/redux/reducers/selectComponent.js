import R from 'ramda';

import {
  SELECT_COMPONENT
} from '../actions.js';

export default function selectComponentReducer(state, action) {
  switch (action.type) {
  case SELECT_COMPONENT: {
    const { hover: { viewID }, views } = state;
    if (viewID) {
      return R.assoc('selected', views[viewID], state);
    } else {
      return R.assoc('selected', undefined, state);
    }
  }
  default:
    return state;
  }
}
