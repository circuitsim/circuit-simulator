import R from 'ramda';

import {
  DELETE_COMPONENT
} from '../actions.js';

export default function selectComponentReducer(state, action) {
  switch (action.type) {
  case DELETE_COMPONENT: {
    return R.dissocPath(['views', action.id], state);
  }
  default:
    return state;
  }
}
