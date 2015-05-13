/* @flow */

'use strict';

import React from 'react';

import {CircuitStore, FullWindowDiagram} from '../src/main.js';

import './styles.scss';

var rootInstance = React.render(<FullWindowDiagram circuitStore={CircuitStore} />, document.getElementById('circuitsim'));

if (module.hot) {
  require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
    getRootInstances: function () {
      // Help React Hot Loader figure out the root component instances on the page:
      return [rootInstance];
    }
  });
}
