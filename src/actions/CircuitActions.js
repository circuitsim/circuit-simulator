import Reflux from 'reflux';

export const CircuitActions = Reflux.createActions([
  'addElement'
]);

export const AddElementActions = Reflux.createActions([
  'start',
  'move',
  'finish'
]);
