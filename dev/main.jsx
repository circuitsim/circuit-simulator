/* @flow */

'use strict';

import React from 'react';
import Animator from 'react-mainloop';

import {CircuitStore, FullWindowDiagram} from '../src/main.js';

import './styles.scss';

const FPS = 20;
const TIMESTEP = 1000 / FPS;

const animate = new Animator(TIMESTEP);

let currentOffset = 0;

const Diagram = animate(FullWindowDiagram, (delta) => {
  currentOffset += delta; // TODO a better way of doing this (and handling overflow)
  return {
    currentOffset
  };
});

const rootInstance = React.render(<Diagram circuitStore={CircuitStore} />, document.getElementById('circuitsim'));

if (module.hot) {
  require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
    getRootInstances: function () {
      // Help React Hot Loader figure out the root component instances on the page:
      return [rootInstance];
    }
  });
}
