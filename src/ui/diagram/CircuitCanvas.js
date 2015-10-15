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

const addProps = ({ handlers, hover, circuitError, currentOffset, volts2RGB }) => component => {
  const hovered = component.id === hover.viewID;
  const hoveredDragPointIndex = hovered
    ? hover.dragPointIndex
    : null;
  return R.assoc('props', R.merge(component.props, {
    handlers: handlers.component,
    hovered,
    hoveredDragPointIndex,
    circuitError,
    currentOffset,
    volts2RGB
  }), component);
};

const lookUpComponent = component => {
  return {
    CircuitComponent: CircuitComponents[component.typeID],
    id: component.id,
    props: component.props
  };
};

const wrapWith = (wrap, views) => {
  const mapIndex = R.addIndex(R.map);
  const apply = ({CircuitComponent, props}, i) => {
    const WrappedComponent = wrap(CircuitComponent);
    if (!WrappedComponent) {
      return undefined;
    }
    return <WrappedComponent {...props} key={views[i].id} />;
  };
  return mapIndex(apply, views);
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
    const mapIndex = R.addIndex(R.map);

    const components = R.pipe(
      R.map(addProps(this.props)),
      R.map(lookUpComponent)
    )(this.props.circuitComponents);

    const circuitComponents = mapIndex(({CircuitComponent, props}, i) => {
      const Component =
        handleHover(
          applyVoltageColor(
            showConnectors(
              CircuitComponent)));
      return <Component {...props} key={components[i].id} />;
    }, components);

    const currentDots = mapIndex(({CircuitComponent, props}, i) => {
      const CurrentPaths = CircuitComponent.getCurrentPaths(props);
      return React.cloneElement(CurrentPaths, {key: components[i].id});
    }, components);

    const labels = wrapWith(showLabel, components);
    const dragPoints = wrapWith(showDragPoints, components);

    return (
      <div ref='canvas'
        onMouseDown={this.onMouse}
        onMouseMove={this.onMouse}
        onMouseUp={this.onMouse}
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
  props: React.PropTypes.object
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
      onMouseUp: React.PropTypes.func
    }).isRequired
  })
};

CircuitCanvas.contextTypes = {
  theme: React.PropTypes.object
};
