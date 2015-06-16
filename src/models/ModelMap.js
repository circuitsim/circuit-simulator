import Resistor from './Resistor.js';

const map = {
  Resistor: Resistor
};

const noop = () => {};

const toModel = (view) => {
  console.log('ModelMap', view.component);
  const Model = map[view.component.name] || noop;

  return new Model(view);
};

export default toModel;
