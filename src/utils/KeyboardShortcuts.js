import Keys from 'keyboard-shortcuts';
import {Elements} from 'circuit-diagram';

export const KeyToElement = {
  [Keys.c]: Elements.CurrentSource,
  [Keys.r]: Elements.Resistor,
  [Keys.w]: Elements.Wire
};
