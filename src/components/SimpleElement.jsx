import React from 'react';

import Circle from 'react-art/lib/Circle.art';

import Colors from '../styles/Colors.js';

export default class SimpleElement extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Circle
        radius={10}
        fill={Colors.base}
        x={this.props.x}
        y={this.props.y}
      />
    );
  }

}
