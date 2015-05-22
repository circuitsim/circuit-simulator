import React from 'react';
import ReactArt from 'react-art';

import Colors from '../styles/Colors.js';

var Surface = ReactArt.Surface;

export default class CircuitCanvas extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const elements = this.props.elements.map(function(element) {
          // https://facebook.github.io/react/docs/multiple-components.html#dynamic-children
          const props = Object.assign({key: element.id}, element.props);
          return React.createElement(element.component, props);
        });
    return (
      <div
        style={{padding: 0, margin: 0, border: 0}}
        onClick={this.props.clickHandler}>
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
  elements: []
};

CircuitCanvas.propTypes = {
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
};
