import React from 'react';
import ReactArt from 'react-art';
import R from 'ramda';
import Utils from '../utils/DrawingUtils.js';
import CircuitComponents from '../diagram/components/AllViews.js';
import handleHover from './highlightOnHover.js';
import showConnectors from './showConnectors.js';

const Surface = ReactArt.Surface;

const create = component => {
  const {CircuitComponent, props} = component;
  return <CircuitComponent {...props} key={props.id} />;
};

const lookUpComponent = component => {
  return {
    CircuitComponent: CircuitComponents[component.typeID],
    props: component.props
  };
};

const addModifiers = component => {
  return {
    CircuitComponent: handleHover(showConnectors(component.CircuitComponent)),
    props: component.props
  };
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
    const { handlers, hover, theme } = this.props;
    const addProps = component => {
      const hovered = component.props.id === hover.viewID;
      const hoveredConnectorIndex = hovered
        ? hover.connectorIndex
        : null;
      return R.assoc('props', R.merge(component.props, {
        handlers: handlers.component,
        theme: theme,
        hovered,
        hoveredConnectorIndex
      }), component);
    };
    const circuitComponents = R.pipe(
      R.map(addProps),
      R.map(lookUpComponent),
      R.map(addModifiers),
      R.map(create)
    )(this.props.circuitComponents);

    return (
      <div ref='canvas'
        onMouseDown={this.onMouse}
        onMouseMove={this.onMouse}
        onMouseUp={this.onMouse}
        onTouchStart={this.onMouse}
        onTouchMove={this.onMouse}
        onTouchEnd={this.onMouse}
        onTouchCancel={this.onMouse}
        style={R.merge({padding: 0, margin: 0, border: 0}, this.props.style)}>
        <Surface
          width={this.props.width}
          height={this.props.height}
          style={{display: 'block', backgroundColor: this.props.theme.COLORS.canvasBackground}}
        >
          {circuitComponents}
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
    },
    component: {
      onMouseOver: () => {},
      onMouseOut: () => {}
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
  theme: React.PropTypes.object.isRequired,
  style: React.PropTypes.object,

  //state
  circuitComponents: React.PropTypes.arrayOf(
    CircuitComponent
  ),
  hover: React.PropTypes.shape({
    viewID: React.PropTypes.string,
    connectorIndex: React.PropTypes.number
  }),

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
