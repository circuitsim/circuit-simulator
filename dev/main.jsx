/* @flow */

'use strict';

import React from 'react';
import Animator from 'react-mainloop';

import {CircuitStore, FullWindowDiagram} from '../src/main.js';

import './styles.scss';

const animate = new Animator();

const Diagram = animate(FullWindowDiagram, (/*delta*/) => {

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
