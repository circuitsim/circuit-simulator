import Reflux from 'reflux';

import {CircuitActions} from '../actions/CircuitActions.js';

import {GRID_SIZE} from '../components/utils/Constants.js';

const snapToGrid = function(connectors) {
  const keys = Object.keys(connectors);
  const snappedConnectors = {};
  keys.forEach(key => snappedConnectors[key] = connectors[key].snap(GRID_SIZE));
  return snappedConnectors;
};

const initialElements = [];

var elements = initialElements;

export default Reflux.createStore({

  listenables: CircuitActions,

  onAddElement(element) {
    element.props.connectors = snapToGrid(element.props.connectors);
    elements.push(element);
    this.trigger(elements);
  },

  getInitialState() {
    return elements;
  }

});
