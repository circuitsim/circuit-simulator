import R from 'ramda';

import {
  SELECT_HOVERED_COMPONENT,
  UNSELECT_COMPONENT
} from '../actions.js';

export default function selectComponentReducer(state, action) {
  switch (action.type) {
  case SELECT_HOVERED_COMPONENT: {
    const { hover: { viewID }, views } = state;
    if (viewID) {
      return R.assoc('selected', views[viewID], state);
    } else {
      return R.assoc('selected', undefined, state);
    }
  }
  case UNSELECT_COMPONENT: {
    if (state.selected.id === action.id) {
      return R.assoc('selected', undefined, state);
    }
    return state;
  }
  default:
    return state;
  }
}
