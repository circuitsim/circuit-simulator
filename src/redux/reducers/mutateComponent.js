import R from 'ramda';

import {
  CHANGE_COMPONENT_VALUE
} from '../actions.js';

export default function selectComponentReducer(state, action) {
  switch (action.type) {
  case CHANGE_COMPONENT_VALUE: {
    return R.pipe(
      R.assoc('circuitChanged', true),
      R.assocPath(['views', action.id, 'value'], action.value)
    )(state);
  }
  default:
    return state;
  }
}
