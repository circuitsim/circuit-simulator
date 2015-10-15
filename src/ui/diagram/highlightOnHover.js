import React from 'react';

import {getDisplayName} from './Utils.js';

export default CircuitElement => {
  const Highlighter = ({ hovered, ...otherProps }, { theme }) => {
    const COLORS = theme.COLORS,
          color = hovered ? COLORS.highlight : null;

    return (
      <CircuitElement
        {...otherProps}
        color={color}
      />
    );
  };

  Highlighter.propTypes = {
    hovered: React.PropTypes.bool
  };

  Highlighter.defaultProps = {
    hovered: false
  };

  Highlighter.contextTypes = {
    theme: React.PropTypes.object
  };

  Highlighter.displayName = `Highlighted(${getDisplayName(CircuitElement)})`;

  return Highlighter;
};
