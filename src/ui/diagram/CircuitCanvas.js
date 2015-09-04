import React from 'react';
import ReactArt from 'react-art';
import R from 'ramda';
import Utils from '../utils/DrawingUtils.js';

const Surface = ReactArt.Surface;

const addPropsAndCreate = (extraProps) => (element) => {
  // https://facebook.github.io/react/docs/multiple-components.html#dynamic-children
  const props = Object.assign({key: element.props.id}, extraProps || {}, element.props);
  return React.createElement(element.component, props);
};

export default class CircuitCanvas extends React.Component {

  constructor(props) {
    super(props);
    this.onMouse = this.onMouse.bind(this);
  }

  onMouse(event) {
    const coords = Utils.relMouseCoords(event, this.refs.canvas);
    const handlers = this.props.handlers.canvas;

    switch (event.type) {
    case 'mousedown':
      handlers.onMouseDown(coords);
      break;
    case 'mousemove':
      handlers.onMouseMove(coords);
      break;
    case 'mouseup':
      handlers.onMouseUp(coords);
      break;
    }
  }

  render() {
    const elements = R.map(addPropsAndCreate({
      handlers: this.props.handlers.component,
      theme: this.props.theme
    }), this.props.elements);

    return (
      <div ref='canvas'
        onMouseDown={this.onMouse}
        onMouseMove={this.onMouse}
        onMouseUp={this.onMouse}
        style={R.merge({padding: 0, margin: 0, border: 0}, this.props.style)}>
        <Surface
          width={this.props.width}
          height={this.props.height}
          style={{display: 'block', backgroundColor: this.props.theme.COLORS.canvasBackground}}
        >
          {elements}
        </Surface>
      </div>
    );
  }
}

CircuitCanvas.defaultProps = {
  elements: [],
  handlers: {
    canvas: {
      onMouseDown: () => {},
      onMouseMove: () => {},
      onMouseUp: () => {}
    },
    component: {
      onMouseOver: () => {},
      onMouseOut: () => {}
    }
  }
};

CircuitCanvas.propTypes = {
  // appearence
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  theme: React.PropTypes.object.isRequired,
  style: React.PropTypes.object,

  //state
  elements: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      component: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.func // ReactClass is a function (could do better checking here)
      ]),
      props: React.PropTypes.object
    })
  ),

  // action creators
  handlers: React.PropTypes.shape({
    component: React.PropTypes.shape({
      onMouseOver: React.PropTypes.func,
      onMouseOut: React.PropTypes.func
    }).isRequired,
    canvas: React.PropTypes.shape({
      onMouseDown: React.PropTypes.func,
      onMouseMove: React.PropTypes.func,
      onMouseUp: React.PropTypes.func
    }).isRequired
  })
};
