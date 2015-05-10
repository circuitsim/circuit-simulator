/* @flow */

'use strict';

import React from 'react';
import ReactArt from 'react-art';

import Circle from 'react-art/lib/Circle.art'

var Surface = ReactArt.Surface;

export default class CircuitDiagram extends React.Component {

  /**
   * [constructor description]
   * @param {object} props
   * @param {number} props.width - Width of the diagram
   * @param {number} props.height - Height of the diagram
   */
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Surface
        width={this.props.width}
        height={this.props.height}
        style={{cursor: 'pointer'}}>
        <Circle
          radius={10}
          stroke="green"
          strokeWidth={3}
          fill="blue"
          x={this.props.width/2}
          y={this.props.height/2}
        />
      </Surface>
    );
  }

}
