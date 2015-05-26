import Reflux from 'reflux';

import {CircuitActions} from '../actions/CircuitActions.js';

const initialElements = [];

var elements = initialElements;

export default Reflux.createStore({

  listenables: CircuitActions,

  onAddElement(element) {
    elements.push(element);
    this.trigger(elements);
  },

  getInitialState() {
    return elements;
  }

});
