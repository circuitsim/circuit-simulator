import React from 'react';
import ReactArt from 'react-art';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {List} from 'immutable';

import Colors from '../styles/Colors.js';

const Surface = ReactArt.Surface;

const create = function(element, extraProps) {
  if (element) {
    // https://facebook.github.io/react/docs/multiple-components.html#dynamic-children
    const props = Object.assign({key: element.id}, element.props, extraProps);
    return React.createElement(element.component, props);
  }
};

export default class CircuitCanvas extends React.Component {

  render() {
    const elements = this.props.elements.map(create),
          mouseHandlers = this.props.mouseHandlers;
    return (
      <div
        {...mouseHandlers}
        style={{padding: 0, margin: 0, border: 0}}>
        <Surface
          width={this.props.width}
          height={this.props.height}
          style={{display: 'block', backgroundColor: Colors.background}}
          >
          {elements}
        </Surface>
      </div>
    );
  }
}

CircuitCanvas.defaultProps = {
  width: 700,
  height: 700,
  elements: new List()
};

CircuitCanvas.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  elements: ImmutablePropTypes.listOf(
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
    })),
  mouseHandlers: React.PropTypes.objectOf(React.PropTypes.func)
};
