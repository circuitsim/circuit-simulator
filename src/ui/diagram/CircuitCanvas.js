import React from 'react';
import { Surface } from 'react-art';
import R from 'ramda';
import Utils from '../utils/DrawingUtils.js';
import CircuitComponents from '../diagram/components';
import showConnectors from './showConnectors.js';
import handleHover from './highlightOnHover.js';
import applyVoltageColor from './applyVoltageColor.js';
import showDragPoints from './showDragPoints.js';
import showLabel from './showComponentLabel.js';

const createComponentInfo = ({ handlers, hover, circuitError, volts2RGB }) => component => {
  const hovered = component.id === hover.viewID;
  const hoveredDragPointIndex = hovered
    ? hover.dragPointIndex
    : null;
  return {
    id: component.id,
    CircuitComponent: CircuitComponents[component.typeID],
    props: R.merge(component, {
      handlers: handlers.component,
      hovered,
      hoveredDragPointIndex,
      circuitError,
      volts2RGB
    })
  };
};

const wrap = wrapper => ({CircuitComponent, props, id}) => {
  const WrappedComponent = wrapper(CircuitComponent);
  if (!WrappedComponent) {
    return undefined;
  }
  return <WrappedComponent {...props} key={id} />;
};

const createComponent = ({CircuitComponent, props, id}) => {
  const Component =
    handleHover(
      applyVoltageColor(
        showConnectors(
          CircuitComponent)));
  return <Component {...props} key={id} />;
};

const createCurrentDots = currentOffset => ({CircuitComponent, props: componentProps, id}) => {
  const props = {
    currentOffset,
    key: id,
    ...componentProps
  };
  return CircuitComponent.getCurrentPaths(props);
};

export default class CircuitCanvas extends React.Component {

  constructor(props) {
    super(props);
    this.onMouse = this.onMouse.bind(this);
  }

  onMouse(event) {
    event.preventDefault();
    const coords = Utils.relMouseCoords(event, this.refs.canvas);
    const handlers = this.props.handlers.canvas;
    switch (event.type) {
    case 'mousedown':
    case 'touchstart':
      handlers.onMouseDown(coords);
      break;
    case 'mousemove':
    case 'touchmove':
      handlers.onMouseMove(coords);
      break;
    case 'mouseup':
    case 'touchend':
      handlers.onMouseUp(coords);
      break;
    case 'touchcancel': // FIXME handle this
      break;
    }
  }

  render() {
    const { width, height } = this.props;

    const components = R.map(createComponentInfo(this.props), this.props.circuitComponents);

    const circuitComponents = R.map(createComponent, components);
    const currentDots = R.map(createCurrentDots(this.props.currentOffset), components);
    const labels = R.map(wrap(showLabel), components);
    const dragPoints = R.map(wrap(showDragPoints), components);

    return (
      <div ref='canvas'
        onMouseDown={this.onMouse}
        onMouseMove={this.onMouse}
        onMouseUp={this.onMouse}
        onMouseEnter={this.props.handlers.canvas.onMouseEnter}
        onMouseLeave={this.props.handlers.canvas.onMouseLeave}
        onTouchStart={this.onMouse}
        onTouchMove={this.onMouse}
        onTouchEnd={this.onMouse}
        onTouchCancel={this.onMouse}
        style={{padding: 0, margin: 0, border: 0}}>
        <Surface
          width={width}
          height={height}
          style={{display: 'block', backgroundColor: this.context.theme.COLORS.canvasBackground}}
        >
          {/* The order is important here */}
          {circuitComponents}
          {labels}
          {currentDots}
          {dragPoints}
        </Surface>
      </div>
    );
  }
}

CircuitCanvas.defaultProps = {
  circuitComponents: [],

  handlers: {
    canvas: {
      onMouseDown: () => {},
      onMouseMove: () => {},
      onMouseUp: () => {}
    }
  }
};

const CircuitComponent = React.PropTypes.shape({
  typeID: React.PropTypes.string,
  id: React.PropTypes.string,
  value: React.PropTypes.number
});

CircuitCanvas.propTypes = {
  // appearence
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  style: React.PropTypes.object,

  //state
  circuitComponents: React.PropTypes.arrayOf(
    CircuitComponent
  ),
  hover: React.PropTypes.shape({
    viewID: React.PropTypes.string,
    dragPointIndex: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.bool
    ])
  }),
  circuitError: React.PropTypes.any,
  currentOffset: React.PropTypes.number,
  volts2RGB: React.PropTypes.func,

  // action creators
  handlers: React.PropTypes.shape({
    canvas: React.PropTypes.shape({
      onMouseDown: React.PropTypes.func,
      onMouseMove: React.PropTypes.func,
      onMouseUp: React.PropTypes.func,
      onMouseEnter: React.PropTypes.func,
      onMouseLeave: React.PropTypes.func
    }).isRequired
  })
};

CircuitCanvas.contextTypes = {
  theme: React.PropTypes.object
};
