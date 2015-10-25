import React from 'react';
import ReactDOM from 'react-dom';

import R from 'ramda';

import Theme from '../src/ui/theme.js';
import App from '../src/App.js';

import { Provider } from 'react-redux';
import configureStore from '../src/redux/configureStore';
import reducer from '../src/redux/reducers';

import getWindowDimensions from '../src/utils/getWindowDimensions.js';

global.__DEV__ = process.env.NODE_ENV === 'development';

if (__DEV__) {
  window.React = React;
}

const COLORS = Theme.COLORS;
const {fontSize, fontFamily} = Theme.TYPOGRAPHY;

const sidebarWidth = 240;
const sidebarWidthPx = `${sidebarWidth}px`;
const defaultStyles = {
  fontSize,
  fontFamily,
  color: COLORS.base
};
const styles = {
  global: {
    html: defaultStyles,
    a: defaultStyles,
    button: defaultStyles
  },
  side: {
    backgroundColor: COLORS.background,
    boxSizing: 'border-box',
    borderRight: `${COLORS.theme} 2px solid`,
    padding: '10px 5px',
    width: sidebarWidthPx,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  }
};

function getCanvasSize() {
  const windowSize = getWindowDimensions();
  return {
    width: windowSize.width - sidebarWidth,
    height: windowSize.height
  };
}

const store = configureStore(reducer);

ReactDOM.render(
  <Provider store={ store }>
    <App
      styles={ styles }
      theme={ Theme }
      getCanvasSize={ getCanvasSize }
    />
  </Provider>,
  document.getElementById('circuitsim')
);
