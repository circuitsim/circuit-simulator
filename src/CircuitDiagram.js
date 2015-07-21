import React from 'react';
import Animator from 'react-mainloop';

import {CircuitCanvas} from 'circuit-diagram';
import Updater from './update/Updater.js';

const FPS = 30;
const TIMESTEP = 1000 / FPS;

const animate = new Animator(TIMESTEP);

export default class CircuitDiagram extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      updater: new Updater()
    };
  }

  render() {
    const updater = this.state.updater,
          Diagram = animate(CircuitCanvas, updater.update, updater.begin);

    return (
      <Diagram
        width={this.props.width}
        height={this.props.height}
        pushEvent={() => { console.log('pushEvent not registered yet'); }} // this should get overidden after first render - this is a bit nasty
      />
    );
  }
}

CircuitDiagram.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number
};
