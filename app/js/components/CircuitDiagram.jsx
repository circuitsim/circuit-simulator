/* @flow */

'use strict';

import React from 'react';
import ReactArt from 'react-art';
import Reflux from 'reflux';

import CircuitCanvas from './CircuitCanvas.jsx';

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

  render() {
    return (
      <CircuitCanvas elements={this.state.elements} {...this.props} />
    );
  }
});
