import React from 'react';
import Animator from 'react-mainloop';

import CircuitCanvas from './CircuitCanvas.js';
import Updater from '../Updater.js';
import resize from '../Resize.js';

// simulate as if running @60FPS, but only render 1 in 10 frames
const MAX_FPS = 10;
const TIMESTEP = 1000 * (1 / 60);

const animate = new Animator(TIMESTEP, MAX_FPS);

// Uses `store` from context to manage the diagram's props using Animator/Updater
class CircuitDiagram extends React.Component {

  componentWillMount() {
    this.updater = new Updater(this.context.store);
  }

  shouldComponentUpdate(nextProps) {
    const {width, height} = this.props;
    return width !== nextProps.width
      || height !== nextProps.height;
  }

  render() {
    const AnimatedDiagram = animate(CircuitCanvas, this.updater.update, this.updater.begin);

    return (
      <AnimatedDiagram
        {...this.props}
      />
    );
  }
}

CircuitDiagram.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired
};

CircuitDiagram.contextTypes = {
  store: React.PropTypes.shape({
    getState: React.PropTypes.func.isRequired,
    dispatch: React.PropTypes.func.isRequired
  }).isRequired
};

export default resize(CircuitDiagram);
