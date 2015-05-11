/* @flow */

'use strict';

import React from 'react';
import FullWindowDiagram from './js/FullWindowDiagram.jsx';

import SimpleElement from './js/SimpleElement.jsx';

import styles from './styles.scss';

var rootInstance;

const elements = [
  {
    id: 1,
    component: SimpleElement,
    props: {
      x: 200,
      y: 200
    }
  }
];

main();

function main() {
  rootInstance = React.render(<FullWindowDiagram elements={elements}/>, document.getElementById('circuitsim'));
}

if (module.hot) {
  require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
    getRootInstances: function () {
      // Help React Hot Loader figure out the root component instances on the page:
      return [rootInstance];
    }
  });
}
