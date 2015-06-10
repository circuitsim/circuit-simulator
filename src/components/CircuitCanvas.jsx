import React from 'react';
import ReactArt from 'react-art';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {Map} from 'immutable';

import Colors from '../styles/Colors.js';
import EventTypes from '../update/EventTypes.js';
import {relMouseCoords} from './utils/DrawingUtils.js';
import {getKeyCombo} from './utils/KeyboardShortcuts.js';

const Surface = ReactArt.Surface;

const addPropsAndCreate = (extraProps) => (element) => {
  // https://facebook.github.io/react/docs/multiple-components.html#dynamic-children
  const props = Object.assign({key: element.props.id}, extraProps || {}, element.props);
  return React.createElement(element.component, props);
};

const convert = {
  mousedown: EventTypes.CanvasMouseDown,
  mousemove: EventTypes.CanvasMouseMove,
  mouseup: EventTypes.CanvasMouseUp,
  keydown: EventTypes.KeyDown
};

export default class CircuitCanvas extends React.Component {

  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onMouse = this.onMouse.bind(this);
  }

  onMouse(event) {
    this.props.pushEvent({
      event,
      type: convert[event.type],
      coords: relMouseCoords(event, this.refs.canvas)
    });
  }

  onKeyDown(event) {
    this.props.pushEvent({
      event,
      type: convert[event.type],
      keys: getKeyCombo(event)
    });
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  render() {
    const elements = this.props.elements
      .toList()
      .map(addPropsAndCreate({
        pushEvent: this.props.pushEvent
      }));
    return (
      <div ref='canvas'
        onMouseDown={this.onMouse}
        onMouseMove={this.onMouse}
        onMouseUp={this.onMouse}
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
  elements: new Map()
};

CircuitCanvas.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  elements: ImmutablePropTypes.mapOf(
    React.PropTypes.shape({
      component: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.func // ReactClass is a function (could do better checking here)
          ]).isRequired,
      props: React.PropTypes.object
    })),
  pushEvent: React.PropTypes.func.isRequired
};
