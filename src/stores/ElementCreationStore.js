import Reflux from 'reflux';

import Vector from 'immutable-vector2d';
import uuid from 'node-uuid';

import {CircuitActions, AddElementActions} from '../actions/CircuitActions.js';

import {GRID_SIZE} from '../components/utils/Constants.js';
import handleHover from '../components/HighlightOnHover.jsx';

const getConnectorPositions = function(component, startPoint, dragPoint) {
  return !component.getConnectorPositions || component.getConnectorPositions(startPoint, dragPoint);
};

export default Reflux.createStore({

  listenables: AddElementActions,

  element: null,
  init: false, // true if element has been initialised

  getInitialState() {
    return this.element;
  },

  onStart(elemType, coords) {
    const startPoint = Vector.fromObject(coords).snap(GRID_SIZE);
    this.element = {
        id: uuid.v4(),
        component: elemType,
        props: {},
        startPoint: startPoint,
        dragPoint: startPoint
      };
    this.init = false;
  },

  onMove(coords) {
    if (this.element) {
      const startPoint = this.element.startPoint,
            dragPoint = Vector.fromObject(coords).snap(GRID_SIZE);

      if (dragPoint.equals(startPoint)) {
        return; // prevent zero size elements
      }

      this.element.props.connectors = getConnectorPositions(this.element.component, startPoint, dragPoint);

      this.init = true;

      this.trigger(this.element);
    }
  },

  onFinish() {
    if (this.element) {
      const element = this.element;
      element.component = handleHover(element.component);

      this.element = null;

      this.trigger();
      if (this.init) { CircuitActions.addElement(element); } // only add element if its position has been initialised

      this.init = false;
    }
  }

});
