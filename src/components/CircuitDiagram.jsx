import React from 'react';
import Reflux from 'reflux';

import CircuitActions from '../actions/CircuitActions.js';

import CircuitCanvas from './CircuitCanvas.jsx';
import Wire from './elements/Wire.jsx';

import Utils from './utils/DrawingUtils.js';
import uuid from 'node-uuid';

module.exports = React.createClass({

  mixins: [Reflux.ListenerMixin],

  getInitialState() {
    return {
      elements: []
    };
  },

  onCircuitChange(elements) {
    this.setState({ elements });
  },

  componentDidMount() {
    this.listenTo(this.props.circuitStore, this.onCircuitChange, this.onCircuitChange);
  },

  onClick(event) {
    const coords = Utils.relMouseCoords(event, this.refs.canvas);
    CircuitActions.addElement(
      {
        id: uuid.v4(),
        component: Wire,
        props: {
          from: {
            x: coords.x,
            y: coords.y
          },
          to: {
            x: coords.x + 50,
            y: coords.y + 50
          }
        }
      }
    );
  },

  render() {
    return (
      <CircuitCanvas ref='canvas' elements={this.state.elements} clickHandler={this.onClick} {...this.props} />
    );
  }
});
