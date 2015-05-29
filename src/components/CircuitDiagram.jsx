import React from 'react/addons';
import Reflux from 'reflux';
import {List} from 'immutable';

import {AddElementActions} from '../actions/CircuitActions.js';

import ElementCreationStore from '../stores/ElementCreationStore.js';

import CircuitCanvas from './CircuitCanvas.jsx';

import Wire from './elements/Wire.jsx';

import {relMouseCoords} from './utils/DrawingUtils.js';
import KeyboardShortcuts from './utils/KeyboardShortcuts.js';

export default React.createClass({

  mixins: [Reflux.ListenerMixin],

  getInitialState() {
    return {
      elements: new List(),
      elementToAdd: Wire,
      addingElement: false,
      elementBeingAdded: null
    };
  },

  onCircuitChange(elements) {
    this.setState({ elements });
  },

  onAddElementChange(element) {
    this.setState({elementBeingAdded: element});
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

    if (KeyboardShortcuts[char]) {
      this.setState({elementToAdd: KeyboardShortcuts[char]});
    }
  },

  startAddElement(event) {
    const elemType = this.state.elementToAdd,
          coords = relMouseCoords(event, this.refs.canvas);

    this.setState({addingElement: true});

    AddElementActions.start(elemType, coords);
  },

  moveElementConnector(event) {
    const coords = relMouseCoords(event, this.refs.canvas);
    AddElementActions.move(coords);
  },

  finishAddElement() {
    this.setState({addingElement: false});
    AddElementActions.finish();
  },

  render() {
    const addingElement = this.state.elementBeingAdded;
    let elements = this.state.elements;
    if (addingElement) { elements = elements.push(addingElement); }
    return (
      <CircuitCanvas ref='canvas'
        elements={elements}
        mouseHandlers={{
          onMouseDown: this.startAddElement,
          onMouseMove: this.state.addingElement ? this.moveElementConnector : () => {},
          onMouseUp: this.state.addingElement ? this.finishAddElement : () => {} // TODO listen for this on document?
        }}
        {...this.props}
      />
    );
  }
});
