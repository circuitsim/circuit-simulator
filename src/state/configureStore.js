import R from 'ramda';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';

import {
  LOOP_BEGIN,
  LOOP_UPDATE,
  UPDATE_CURRENT_OFFSETS,
  RATIONALISE_CURRENT_OFFSETS,
  ADDING_MOVED,
  MOVING_MOVED,
  MOUSE_MOVED,
  SET_HOVERED_COMPONENT
} from './actions';
import createLogger from 'redux-logger';

const logger = createLogger({
  predicate: (getState, action) => {
    return __DEV__ && R.all(t => t !== action.type)([
      LOOP_BEGIN,
      LOOP_UPDATE,
      UPDATE_CURRENT_OFFSETS,
      RATIONALISE_CURRENT_OFFSETS,
      ADDING_MOVED,
      MOVING_MOVED,
      MOUSE_MOVED,
      SET_HOVERED_COMPONENT
    ]);
  },
  collapsed: true
});

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  logger
)(createStore);

export default function configureStore() {
  return createStoreWithMiddleware(rootReducer);
}
