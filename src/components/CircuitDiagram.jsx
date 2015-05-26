import React from 'react/addons';
import Reflux from 'reflux';

import {AddElementActions} from '../actions/CircuitActions.js';

import ElementCreationStore from '../stores/ElementCreationStore.js';

import CircuitCanvas from './CircuitCanvas.jsx';

import {Wire, Resistor, CurrentSource} from './elements/All.js';

import handleHover from './HighlightOnHover.jsx';

import {relMouseCoords} from './utils/DrawingUtils.js';

export default React.createClass({

  mixins: [Reflux.ListenerMixin],

  getInitialState() {
    return {
      elements: [],
      elementToAdd: handleHover(Wire),
      addingElement: null
    };
  },

  onCircuitChange(elements) {
    this.setState({ elements });
  },

  onAddElementChange(element) {
    this.setState({addingElement: element});
  },

  componentDidMount() {
    this.listenTo(this.props.circuitStore, this.onCircuitChange, this.onCircuitChange);
    this.listenTo(ElementCreationStore, this.onAddElementChange);
    window.addEventListener('keypress', this.onKeyPress);
  },

  componentWillUnmount() {
    window.removeEventListener('keypress', this.onKeyPress);
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

    AddElementActions.start(elemType, coords);
  },

  moveElementConnector(event) {
    const coords = relMouseCoords(event, this.refs.canvas);
    AddElementActions.move(coords);
  },

  addElement() {
    AddElementActions.finish();
  },

  render() {
    return (
      <CircuitCanvas ref='canvas'
        elements={this.state.elements}
        elementBeingAdded={this.state.addingElement}
        mouseHandlers={{
          onMouseDown: this.startAddElement,
          onMouseMove: this.state.addingElement ? this.moveElementConnector : () => {},
          onMouseUp: this.state.addingElement ? this.addElement : () => {}
        }}
        {...this.props}
      />
    );
  }
});
