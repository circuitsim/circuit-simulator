import Enum from 'symbol-enum';

import CircuitElements from '../components/elements/All.js';

const Keys = new Enum(
  'c',
  'r',
  'w',
  'ctrl+z',
  'ctrl+y'
);

export const KeyToElement = {
  [Keys.c]: CircuitElements.CurrentSource,
  [Keys.r]: CircuitElements.Resistor,
  [Keys.w]: CircuitElements.Wire
};

export const UndoRedo = {
  // TODO how to we map keys to undo/redo? we can't just make an action for it...
};

export const getKeyCombo = event => {
  const char = String.fromCharCode(event.keyCode || event.charCode).toLowerCase();
  if (event.ctrlKey) {
    return Keys['ctrl+' + char];
  }
  return Keys[char];
};
