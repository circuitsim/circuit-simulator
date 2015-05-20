import React from 'react';
import Reflux from 'reflux';

import CircuitActions from '../actions/CircuitActions.js';

import CircuitCanvas from './CircuitCanvas.jsx';
import Resistor from './elements/Resistor.jsx';

import Utils from './utils/DrawingUtils.js';
import uuid from 'node-uuid';
import Vector from 'immutable-vector2d';

export default React.createClass({

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
        component: Resistor,
        props: {
          from: Vector.fromObject({
            x: coords.x,
            y: coords.y
          }),
          to: Vector.fromObject({
            x: coords.x + 50,
            y: coords.y + 50
          })
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
