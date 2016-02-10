import Color from 'color';


export const decayMaxVoltage = () => {
  // TODO
};

/**
 * Converts a voltage to a color.
 *
 * The ratio between the voltage and the 'max voltage' is used to determine the color.
 *
 * For DC circuits, the 'max voltage' will be the maximum absolute voltage
 * currently present in the circuit.
 *
 * For AC circuits, the 'max voltage' will be a recent maximum absolute
 * voltage, decayed slowly over time. TODO
 */
export const createVolts2RGB = (maxVoltage) => ({
  // colors
  positiveVoltage: pos,
  negativeVoltage: neg,
  base: ground
}) => v => {
  const g = new Color(ground);

  const proportion = maxVoltage === 0
    ? 0
    : Math.abs(v) / Math.abs(maxVoltage);

  return (v >= 0
    ? g.mix(new Color(pos), 1 - proportion)
    : g.mix(new Color(neg), 1 - proportion)).rgbString();
};
