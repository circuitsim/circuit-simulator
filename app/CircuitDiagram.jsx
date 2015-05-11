/* @flow */

'use strict';

import React from 'react';
import ReactArt from 'react-art';

var Surface = ReactArt.Surface;

export default class CircuitDiagram extends React.Component {

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
  height: 700,
  elements: []
};

CircuitDiagram.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  elements: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      id: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
          ]).isRequired,
      component: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.func // ReactClass is a function (could do better checking here)
          ]).isRequired,
      props: React.PropTypes.object
    }))
}
