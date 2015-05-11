/* @flow */

'use strict';

import React from 'react';
import ReactArt from 'react-art';

var Surface = ReactArt.Surface;

export default class CircuitDiagram extends React.Component {

  /**
   * @param {object} props
   * @param {number} props.width - Width of the diagram
   * @param {number} props.height - Height of the diagram
   * @param {object[]} props.elements - Circuit elements
   */
  constructor(props) {
    super(props);
  }

  render() {
    var elements = this.props.elements.map(function(element) {
          return React.createElement(element.component, {key: element.id, ...element.props});
        });
    return (
      <Surface
        width={this.props.width}
        height={this.props.height}>
        {elements}
      </Surface>
    );
  }
}

CircuitDiagram.defaultProps = {
  width: 700,
  height: 700
};
