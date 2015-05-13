import Reflux from 'reflux';

import SimpleElement from '../components/SimpleElement.jsx';

import circuitActions from '../actions/CircuitActions.js';

import uuid from 'node-uuid';

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

const circuitStore = Reflux.createStore({

  listenables: circuitActions,

  onAddElement(element) {
    elements.push(element);
    this.trigger(elements);
  },

  getInitialState() {
    return elements;
  }

});

module.exports = circuitStore;
