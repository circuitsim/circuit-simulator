import React from 'react';
import Theme from 'circuitsim-theme';
import App from '../src/App.js';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import reducer from '../src/reducers';

// expose for devTools
window.React = React;

const COLORS = Theme.COLORS;
const {lineHeight, fontSize, fontFamily} = Theme.TYPOGRAPHY;

const sidebarWidth = 300;
const sidebarWidthPx = `${sidebarWidth}px`;
const styles = {
  global: {
    '*': {
      lineHeight,
      fontSize,
      fontFamily,
      backgroundColor: COLORS.background,
      color: COLORS.base
    }
  },
  main: {
    position: 'absolute',
    top: '0px',
    left: sidebarWidthPx,
    right: '0px',
    bottom: '0px'
  },
  side: {
    position: 'absolute',
    width: sidebarWidthPx,
    top: '0px',
    left: '0px',
    bottom: '0px'
  }
};
const windowSize = (function getDimensions() {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
})();
const canvasSize = { // FIXME this needs to change if the window size changes
  width: windowSize.width - sidebarWidth,
  height: windowSize.height
};

const store = createStore(reducer);

React.render(
  <Provider store={ store }>
    <App
      styles={ styles }
      theme={ Theme }
      canvasDimensions={ canvasSize }
    />
  </Provider>,
  document.getElementById('circuitsim')
);
