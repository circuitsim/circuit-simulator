/* @flow */

'use strict';

import React from 'react';
import ReactArt from 'react-art';
import Reflux from 'reflux';

import CircuitActions from '../actions/CircuitActions.jsx';

import CircuitCanvas from './CircuitCanvas.jsx';
import SimpleElement from './SimpleElement.jsx';

import Utils from '../utils/utils.js';
import uuid from 'node-uuid';

var Surface = ReactArt.Surface;

module.exports = React.createClass({

  mixins: [Reflux.ListenerMixin],

  getInitialState() {
    return {
      elements: []
    };
  },

  _onCircuitChange(elements) {
    this.setState({
      elements
    });
  },

  componentDidMount() {
      this.listenTo(this.props.circuitStore, this._onCircuitChange, this._onCircuitChange);
  },

  _onClick(event) {
    const coords = Utils.relMouseCoords(event, this.refs.canvas);
    CircuitActions.addElement(
      {
        id: uuid.v4(),
        component: SimpleElement,
        props: {
          x: coords.x,
          y: coords.y
        }
      }
    );
  },

  render() {
    return (
      <CircuitCanvas ref='canvas' elements={this.state.elements} clickHandler={this._onClick} {...this.props} />
    );
  }
});
