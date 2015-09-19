import React from 'react';

import {getDisplayName} from './Utils.js';

export default CircuitElement => {
  const Highlighter = props=> {
    const {hovered = false, theme} = props,
          COLORS = theme.COLORS,
          color = hovered ? COLORS.highlight : COLORS.base;

    return (
      <CircuitElement
        {...props}
        color={color}
      />
    );
  };

  Highlighter.propTypes = {
    hovered: React.PropTypes.bool,
    theme: React.PropTypes.object.isRequired
  };

  Highlighter.displayName = `Highlighted(${getDisplayName(CircuitElement)})`;

  return Highlighter;
};
