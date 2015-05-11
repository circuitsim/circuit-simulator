/* @flow */

'use strict';

import React from 'react';
import ReactArt from 'react-art';

import CircuitCanvas from './CircuitCanvas.jsx';

var Surface = ReactArt.Surface;

export default class CircuitDiagram extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      elements: []
    }
  }

  render() {
    return (
      <CircuitCanvas elements={this.state.elements} {...this.props} />
    );
  }
}
