import React from 'react';
import R from 'ramda';

import {getDisplayName} from './Utils.js';

/**
 * Wraps a component and sets a color for each voltage.
 *
 * If a parent component has already set a color, it uses that instead.
 */
export default CircuitElement => {
  const ApplyVoltageColor = ({ color, voltages, volts2RGB, ...otherProps }, { theme }) => {
    const colors = color
      ? R.repeat(color, voltages.length)
      : R.map(voltage => volts2RGB(theme.COLORS)(voltage), voltages);

    return (
      <CircuitElement
        {...otherProps}
        colors={colors}
      />
    );
  };

  ApplyVoltageColor.propTypes = {
    color: React.PropTypes.string,
    voltages: React.PropTypes.arrayOf(React.PropTypes.number),
    volts2RGB: React.PropTypes.func.isRequired
  };

  ApplyVoltageColor.contextTypes = {
    theme: React.PropTypes.object
  };

  ApplyVoltageColor.displayName = `VoltageColorFor(${getDisplayName(CircuitElement)})`;

  return ApplyVoltageColor;
};
