import Color from 'color';

const TT = 0.999;
const decayMaxVoltage = (max, prevMax) => {
  if (prevMax < max) {
    return max;
  }
  if (TT * prevMax < max) {
    return max;
  }
  return TT * prevMax;
};

/**
 * Converts a voltage to a color.
 *
 * The ratio between the voltage and the 'max voltage' is used to determine the color.
 *
 * For DC circuits, the 'max voltage' will be the maximum absolute voltage
 * currently present in the circuit.
 *
 * For AC circuits, the 'max voltage' is be a recent maximum absolute
 * voltage, decayed slowly over time.
 */
export const createVolts2RGB = (maxVoltage, prevVoltageRange) => {
  const voltageRange = decayMaxVoltage(maxVoltage, prevVoltageRange);
  const volts2RGB = ({
    // colors
    positiveVoltage: pos,
    negativeVoltage: neg,
    base: ground
  }) => v => {
    const g = new Color(ground);

    const proportion = voltageRange === 0
      ? 0
      : Math.abs(v) / Math.abs(voltageRange);

    return (v >= 0
      ? g.mix(new Color(pos), 1 - proportion)
      : g.mix(new Color(neg), 1 - proportion)).rgbString();
  };
  return {
    voltageRange,
    volts2RGB
  };
};
