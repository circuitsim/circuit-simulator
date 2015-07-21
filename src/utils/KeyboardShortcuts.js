import Keys from 'keyboard-shortcuts';
import {Elements} from 'circuit-diagram';

export const KeyToElement = {
  [Keys.c]: Elements.CurrentSource,
  [Keys.r]: Elements.Resistor,
  [Keys.w]: Elements.Wire
};

export const UndoRedo = {
  // TODO how to we map keys to undo/redo? we can't just make an action for it...
};
