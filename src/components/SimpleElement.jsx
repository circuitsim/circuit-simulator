/* @flow */

'use strict';

import React from 'react';

import Circle from 'react-art/lib/Circle.art';

export default class SimpleElement extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Circle
        onClick={this.onClick}
        radius={10}
        fill='blue'
        x={this.props.x}
        y={this.props.y}
      />
    );
  }

}
