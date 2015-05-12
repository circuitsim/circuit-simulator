/* @flow */

'use strict';

import React from 'react';
import FullWindowDiagram from './js/components/FullWindowDiagram.jsx';

import circuitStore from './js/stores/CircuitStore.js';

import './styles.scss';

var rootInstance = React.render(<FullWindowDiagram circuitStore={circuitStore} />, document.getElementById('circuitsim'));

if (module.hot) {
  require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
    getRootInstances: function () {
      // Help React Hot Loader figure out the root component instances on the page:
      return [rootInstance];
    }
  });
}
