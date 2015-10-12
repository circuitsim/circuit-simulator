import React from 'react';

import {getDisplayName} from './Utils.js';

export default CircuitElement => {
  const Highlighter = (props, { theme }) => {
    const { hovered = false } = props,
          COLORS = theme.COLORS,
          color = hovered ? COLORS.highlight : null;

    return (
      <CircuitElement
        {...props}
        color={color}
      />
    );
  };

  Highlighter.propTypes = {
    hovered: React.PropTypes.bool
  };

  Highlighter.contextTypes = {
    theme: React.PropTypes.object
  };

  Highlighter.displayName = `Highlighted(${getDisplayName(CircuitElement)})`;

  return Highlighter;
};
