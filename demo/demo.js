import React from 'react';
import { Style } from 'radium';
import Theme from 'circuitsim-theme';
import ComponentSelector from 'circuitsim-component-selector';
import CircuitDiagram from '../src/CircuitDiagram.js';

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
const mainWidth = windowSize.width - sidebarWidth;
const mainHeight = windowSize.height;

React.render(
  <div >
    <Style
      rules={ styles.global }
    />
    <ComponentSelector theme={ Theme } style={ styles.side } />
    <CircuitDiagram theme={ Theme } style={ styles.main } width={ mainWidth } height={ mainHeight } />
  </div>,
  document.getElementById('circuitsim')
);
