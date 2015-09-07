import Keys from 'keyboard-shortcuts';
import CircuitComponents from '../ui/diagram/components/AllViews.js';

export const KeyToElement = {
  [Keys.c]: CircuitComponents.CurrentSource,
  [Keys.r]: CircuitComponents.Resistor,
  [Keys.w]: CircuitComponents.Wire
};
