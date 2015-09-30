import Color from 'color';

export default maxVoltage => ({
  // colors
  positiveVoltage: pos,
  negativeVoltage: neg,
  base: ground
}) => v => {
  ground = new Color(ground);

  const proportion = maxVoltage === 0
    ? 0
    : Math.abs(v) / Math.abs(maxVoltage);

  return (v >= 0
    ? ground.mix(new Color(pos), 1 - proportion)
    : ground.mix(new Color(neg), 1 - proportion)).rgbString();
};
