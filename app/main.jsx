/* @flow */

'use strict';

import React from 'react';
import Hello from './Hello.jsx';

var rootInstance;

main();

function main() {
  rootInstance = React.render(<Hello />, document.getElementById('circuitsim'));
}

if (module.hot) {
  require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
    getRootInstances: function () {
      // Help React Hot Loader figure out the root component instances on the page:
      return [rootInstance];
    }
  });
}
