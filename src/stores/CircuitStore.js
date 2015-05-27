import Reflux from 'reflux';
import {List} from 'immutable';

import {CircuitActions} from '../actions/CircuitActions.js';

const initialElements = new List();

export default Reflux.createStore({

  listenables: CircuitActions,

  elements: initialElements,

  onAddElement(element) {
    this.elements = this.elements.push(element);
    this.trigger(this.elements);
  },

  getInitialState() {
    return this.elements;
  }

});
