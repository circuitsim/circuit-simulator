import uuid from 'node-uuid';
import Vector from 'immutable-vector2d';

import {GRID_SIZE} from '../../components/utils/Constants.js';
import EventTypes from '../EventTypes.js';
import Modes from '../Modes.js';
import handleHover from '../../components/HighlightOnHover.jsx';

/*
 * START ADDING ELEMENT
 */

const addHandlers = {
  [EventTypes.CanvasMouseDown]: (elemType, coords) => ({
      mode: Modes.adding(elemType, uuid.v4(), coords)
    })
};

export const handleStartAddFor = elemType => event => {
  const handler = addHandlers[event.type];
  return handler ? handler(elemType, event.coords) : null;
};

/*
 * MOVE ELEMENT
 */

const getConnectorPositions = function(component, startPoint, dragPoint) {
  return !component.getConnectorPositions || component.getConnectorPositions(startPoint, dragPoint);
};

const MoveElementAction = function(type, id, startCoords, dragCoords) {
  this.do = (state) => {
    const startPoint = Vector.fromObject(startCoords).snap(GRID_SIZE),
          dragPoint = Vector.fromObject(dragCoords).snap(GRID_SIZE);

    if (dragPoint.equals(startPoint)) {
      return state; // prevent zero size elements
    }

    return state.set('addingElement', {
        component: type,
        props: {
          id,
          connectors: getConnectorPositions(type, startPoint, dragPoint)
        }
      });
  };
};

const addingHandlers = {
  [EventTypes.CanvasMouseMove]: (type, id, start, drag) => ({
    action: new MoveElementAction(type, id, start, drag)
  })
};

export const handleAdding = (type, id, startCoords) => event => { // TODO make a reusable version of this
  const handler = addingHandlers[event.type];
  return handler ? handler(type, id, startCoords, event.coords) : null;
};

/*
 * FINISH ADDING
 */

const AddElementAction = function(id) {
  let element;
  this.do = (state) => {
    if (element) { // redo
      return state.setIn(['elements', id], element);
    }
    // adding for the first time - TODO get rid of 'addingElement'
    const elem = state.get('addingElement');
    if (!elem) {
      return state;
    }
    elem.component = handleHover(elem.component);
    return state
      .setIn(['elements', id], elem)
      .set('addingElement', null);
  };
  this.undo = (state) => {
    element = state.elements.get(id);
    return state.elements.delete(id);
  };
};

const finishAddingHandlers = {
  [EventTypes.CanvasMouseUp]: (id, type) => ({
    action: new AddElementAction(id),
    mode: Modes.add(type)
  })
};

export const handleFinishAddFor = (id, type) => event => { // TODO make a reusable version of this
  const handler = finishAddingHandlers[event.type];
  return handler ? handler(id, type) : null;
};
