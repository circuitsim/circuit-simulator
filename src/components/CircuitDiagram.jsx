import React from 'react/addons';
import Reflux from 'reflux';

import CircuitActions from '../actions/CircuitActions.js';

import CircuitCanvas from './CircuitCanvas.jsx';

import Wire from './elements/Wire.jsx';
import Resistor from './elements/Resistor.jsx';
import CurrentSource from './elements/CurrentSource.jsx';

import handleHover from './HighlightOnHover.jsx';

import {relMouseCoords} from './utils/DrawingUtils.js';
import uuid from 'node-uuid';
import Vector from 'immutable-vector2d';

export default React.createClass({

  mixins: [Reflux.ListenerMixin],

  getInitialState() {
    return {
      elements: [],
      elementToAdd: handleHover(Wire),
      elementBeingAdded: null,
      addingElement: false
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
    const coords = relMouseCoords(event, this.refs.canvas);
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
          this.setState({elementToAdd: handleHover(CurrentSource)});
          break;
      case 'r':
          this.setState({elementToAdd: handleHover(Resistor)});
          break;
      case 'w':
          this.setState({elementToAdd: handleHover(Wire)});
          break;
      default:
          console.log('noop');
    }
  },

  startAddElement(event) {
    const elemType = this.state.elementToAdd,
          coords = relMouseCoords(event, this.refs.canvas);

    this.setState({
      elementBeingAdded:
        {
          id: uuid.v4(),
          component: elemType,
          props: {
            connectors: {
              from: Vector.fromObject({
                x: coords.x,
                y: coords.y
              }),
              to: Vector.fromObject({
                x: coords.x + 10,
                y: coords.y + 10
              })
            }
          }
        },
      addingElement: true
    });
  },

  moveElementConnector(event) {
    const coords = relMouseCoords(event, this.refs.canvas),
          currentElem = this.state.elementBeingAdded;
    this.setState(
      {
        elementBeingAdded:
          React.addons.update(currentElem,
            {
              props: {
                connectors: {
                  to: {$set: Vector.fromObject({
                      x: coords.x,
                      y: coords.y
                    })
                  }
                }
              }
            })
        });
  },

  addElement() {
    CircuitActions.addElement(this.state.elementBeingAdded);
    this.setState({elementBeingAdded: null, addingElement: false});
  },

  render() {
    return (
      <CircuitCanvas ref='canvas'
        elements={this.state.elements}
        elementBeingAdded={this.state.elementBeingAdded}
        mouseHandlers={{
          onMouseDown: this.startAddElement,
          onMouseMove: this.state.addingElement ? this.moveElementConnector : () => {},
          onMouseUp: this.state.addingElement ? this.addElement : () => {}
          // onClick: this.onClick
        }}
        {...this.props}
      />
    );
  }
});
