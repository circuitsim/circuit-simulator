/* @flow */

'use strict';

import React from 'react';
import { Style } from 'radium';
// import FullScreen from 'react-fullscreen';
import Theme from 'circuitsim-theme';
import ComponentSelector from 'circuitsim-component-selector';
import CircuitDiagram from '../src/CircuitDiagram.js';

const COLORS = Theme.COLORS;
const {lineHeight, fontSize, fontFamily} = Theme.TYPOGRAPHY;

// expose for devTools
window.React = React;

React.render(
  <div >
    <Style
      rules={{
        '*': {
          lineHeight,
          fontSize,
          fontFamily,
          backgroundColor: COLORS.background,
          color: COLORS.base
        }
      }}
    />
    <ComponentSelector theme={ Theme }  />
    <CircuitDiagram theme={ Theme }  />
  </div>,
  document.getElementById('circuitsim')
);
