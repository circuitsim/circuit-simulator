/* @flow */

'use strict';

import React from 'react';
import CircuitDiagram from './CircuitDiagram.jsx';

var rootInstance;

main();

function main() {
  rootInstance = React.render(<CircuitDiagram />, document.getElementById('circuitsim'));
}

if (module.hot) {
  require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
    getRootInstances: function () {
      // Help React Hot Loader figure out the root component instances on the page:
      return [rootInstance];
    }
  });
}
