import {
  SELECT_HOVERED_COMPONENT,
  UNSELECT_COMPONENT
} from '../actions.js';

export default function selectComponentReducer(selected = null, action) {
  switch (action.type) {
  case SELECT_HOVERED_COMPONENT: {
    const { hover, views } = action;
    if (hover.viewID) {
      return views[hover.viewID];
    } else {
      return null;
    }
  }
  case UNSELECT_COMPONENT: {
    if (action.selected.id === action.id) {
      return null;
    }
    return selected;
  }
  default:
    return selected;
  }
}
