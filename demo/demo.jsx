/* @flow */

'use strict';

import React from 'react';

import {FullWindow, CircuitDiagram} from '../src/main.js';

const rootInstance = React.render(
  <FullWindow>
    <CircuitDiagram />
  </FullWindow>,
  document.getElementById('circuitsim')
);

if (module.hot) {
  require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
    getRootInstances: function () {
      // Help React Hot Loader figure out the root component instances on the page:
      return [rootInstance];
    }
  });
}
