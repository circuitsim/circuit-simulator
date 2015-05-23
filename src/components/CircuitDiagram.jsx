import React from 'react';
import Reflux from 'reflux';

import CircuitActions from '../actions/CircuitActions.js';

import CircuitCanvas from './CircuitCanvas.jsx';

import Wire from './elements/Wire.jsx';
import Resistor from './elements/Resistor.jsx';
import CurrentSource from './elements/CurrentSource.jsx';

import Utils from './utils/DrawingUtils.js';
import uuid from 'node-uuid';
import Vector from 'immutable-vector2d';

export default React.createClass({

  mixins: [Reflux.ListenerMixin],

  getInitialState() {
    return {
      elements: [],
      elementToAdd: Wire
    };
  },

  onCircuitChange(elements) {
    this.setState({ elements });
  },

  componentDidMount() {
    this.listenTo(this.props.circuitStore, this.onCircuitChange, this.onCircuitChange);
    window.addEventListener('keypress', this.onKeyPress);
  },

  componentWillUnmount() {
    window.removeEventListener('keypress', this.onKeyPress);
  },

  onClick(event) {
    const coords = Utils.relMouseCoords(event, this.refs.canvas);
    CircuitActions.addElement(
      {
        id: uuid.v4(),
        component: this.state.elementToAdd,
        props: {
          connectors: {
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
      }
    );
  },

  onKeyPress(event) {
    const char = String.fromCharCode(event.keyCode || event.charCode);
    switch(char) {
      case 'c':
          this.setState({elementToAdd: CurrentSource});
          break;
      case 'r':
          this.setState({elementToAdd: Resistor});
          break;
      case 'w':
          this.setState({elementToAdd: Wire});
          break;
      default:
          console.log('noop');
    }
  },

  render() {
    return (
      <CircuitCanvas ref='canvas'
        elements={this.state.elements}
        clickHandler={this.onClick} {...this.props}
      />
    );
  }
});
