import Reflux from 'reflux';

import Vector from 'immutable-vector2d';

import SimpleElement from '../components/SimpleElement.jsx';

import circuitActions from '../actions/CircuitActions.js';

import uuid from 'node-uuid';

const GRID_SIZE = 20;

const snap = function (snapTo) {
  var f = function(val) {
    return Math.round(val / snapTo) * snapTo;
  };
  return vec => new Vector(f(vec.x), f(vec.y));
};

const snapToGrid = function(connectors) {
  const keys = Object.keys(connectors);
  const snappedConnectors = {};
  keys.forEach(key => snappedConnectors[key] = snap(GRID_SIZE)(connectors[key]));
  // keys.forEach(key => snappedConnectors[key] = connectors[key].snap(GRID_SIZE)); // TODO change once vector lib accepts PR
  return snappedConnectors;
};

const initialElements = [
    {
      id: uuid.v4(),
      component: SimpleElement,
      props: {
        x: 200,
        y: 200
      }
    }
  ];

var elements = initialElements;

export default Reflux.createStore({

  listenables: circuitActions,

  onAddElement(element) {
    element.props.connectors = snapToGrid(element.props.connectors);
    elements.push(element);
    this.trigger(elements);
  },

  getInitialState() {
    return elements;
  }

});
