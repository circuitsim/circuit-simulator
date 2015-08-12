/* @flow */

'use strict';

import React from 'react';
// import FullScreen from 'react-fullscreen';
import Theme from 'circuitsim-theme';
// import ComponentSelector from 'circuitsim-component-selector';
import CircuitDiagram from '../src/CircuitDiagram.js';

// expose for devTools
window.React = React;

    // <ComponentSelector theme={ Theme }  />
React.render(
  <div >
    <CircuitDiagram theme={ Theme }  />
  </div>,
  document.getElementById('circuitsim')
);
