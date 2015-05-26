import CurrentSource from './CurrentSource.jsx';
import Resistor from './Resistor.jsx';
import Wire from './Wire.jsx';

// there must be a better way of doing this...
// I think I tried dynamically importing all files in the dir but it all went a bit iffy with either React or Webpack

export default {
  CurrentSource: CurrentSource,
  Resistor: Resistor,
  Wire: Wire
};
