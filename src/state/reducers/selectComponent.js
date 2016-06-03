import R from 'ramda';
import {
  SELECT_HOVERED_COMPONENT,
  UNSELECT_COMPONENT
} from '../actions';

export default function selectComponentReducer(selected = null, action) {
  switch (action.type) {
  case SELECT_HOVERED_COMPONENT: {
    const { views } = action;
    const hoveredComponent = R.find(c => c.hovered, R.values(views));
    if (hoveredComponent) {
      return hoveredComponent.id;
    } else {
      return null;
    }
  }
  case UNSELECT_COMPONENT: {
    if (action.selected === action.id) {
      return null;
    }
    return selected;
  }
  default:
    return selected;
  }
}
