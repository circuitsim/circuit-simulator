import {
  ADDING_START,
  ADDING_FINISH
} from '../actions';

// addingComponent: {
//   id,
//   start: coords,
//   typeID
// }
export default function addingComponentReducer(addingComponent = {}, action) {
  switch (action.type) {
  case ADDING_START: {
    const {coords, typeID, id} = action;
    return {
      id,
      typeID,
      start: coords
    };
  }

  case ADDING_FINISH: {
    return {};
  }

  default:
    return addingComponent;
  }
}
