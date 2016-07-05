import R from 'ramda';
import Vector from 'immutable-vector2d';

import Components from '../../ui/diagram/components';
import { diff } from '../../ui/utils/DrawingUtils.js';
import { snapToGrid } from '../../ui/diagram/Utils.js';
import { hoverFor } from '../../ui/diagram/boundingBox';
import { CURRENT } from '../../ui/diagram/Constants';

import {
  LOAD_CIRCUIT,
  PRINT_CIRCUIT,
  ADDING_MOVED,
  MOVING_MOVED,
  DELETE_COMPONENT,
  EDIT_COMPONENT,
  CHANGE_COMPONENT_FREQ,
  SET_HOVERED_COMPONENT,
  UPDATE_CURRENT_OFFSETS,
  RATIONALISE_CURRENT_OFFSETS
} from '../actions';

const STANDING_OFFSET = CURRENT.DOT_DISTANCE / 2;

const zip3 = (a, b, c) => R.zipWith(R.prepend, a, R.zip(b, c));
const moreThanOne = R.pipe(
  R.length,
  R.gt(R.__, 1)
);
const mergeOverWith = R.partial(R.merge, [R.__]);

const isHovered = component => component.hovered;

function moveSingleDragPoint(views, action) {
  const { id, dragPointIndex, origDragPoints } = action.movingComponent; // FIXME REDUCERES

  const view = views[id],
        Component = Components[view.typeID],

        fixedPointIndex = dragPointIndex === 0 ? 1 : 0,
        newDragPoint = Component.dragPoint(action.mouseVector, {fixed: origDragPoints[fixedPointIndex]}),
        dragPoints = R.update(dragPointIndex, newDragPoint, origDragPoints),

        tConnectors = Component.transform.getTransformedConnectors(dragPoints),
        connectors = Component.transform.getConnectors(dragPoints);

  return {
    ...views,
    [id]: {
      ...view,
      dragPoints,
      tConnectors,
      connectors
    }
  };
}

function moveWholeComponent(views, action) {
  const { id, from, origDragPoints } = action.movingComponent;

  const view = views[id],
        Component = Components[view.typeID],

        diffVector = diff(from, action.mouseVector),
        dragPoints = R.map(v => snapToGrid(v.subtract(diffVector)), origDragPoints),

        tConnectors = Component.transform.getTransformedConnectors(dragPoints),
        connectors = Component.transform.getConnectors(dragPoints);

  return {
    ...views,
    [id]: {
      ...view,
      dragPoints,
      tConnectors,
      connectors
    }
  };
}

/*
 * view = {
 *  typeID - type of view e.g. Resistor
 *  id - UID
 *  editables - e.g. {voltage: {value: 5Ω}}
 *  dragPoints - real coordinates of the two drag points
 *  tConnectors - coordinates of the connectors in the transformed canvas (used for rendering)
 *  connectors - coordinates of the connectors in the real canvas
 *
 *  currentOffsets - keeps track of current flow
 *  extraOffsets - to be added to currentOffsets next render
 * }
 */
export default function viewsReducer(views = {}, action) {
  switch (action.type) {
  case LOAD_CIRCUIT: {
    const { circuit } = action;
    const setInitialCurrentPositions = (view) => {
      const ComponentType = Components[view.typeID];
      return {
        ...view,
        currentOffsets: R.repeat(STANDING_OFFSET, ComponentType.numOfCurrentPaths),
        extraOffsets: R.repeat(0, ComponentType.numOfCurrentPaths)
      };
    };
    const vectoriseDragPoints = (view) => {
      return {
        ...view,
        dragPoints: R.map(Vector.fromObject, view.dragPoints)
      };
    };
    const setConnectorPositions = (view) => {
      const ComponentType = Components[view.typeID];
      return {
        ...view,
        tConnectors: ComponentType.transform.getTransformedConnectors(view.dragPoints),
        connectors: ComponentType.transform.getConnectors(view.dragPoints)
      };
    };
    const loadedViews = R.pipe(
      R.map(setInitialCurrentPositions),
      R.map(vectoriseDragPoints),
      R.map(setConnectorPositions),
      R.groupBy(R.prop('id')),
      R.map(R.head)
    )(circuit);
    return loadedViews;
  }
  case PRINT_CIRCUIT: {
    const output = R.pipe(
      R.values,
      R.map(R.pick(['typeID', 'id', 'editables', 'dragPoints']))
    )(views);
    console.log(JSON.stringify(output)); // eslint-disable-line no-console
    return views;
  }
  case ADDING_MOVED: {
    const {start, id, typeID} = action.addingComponent,

          startPoint = snapToGrid(Vector.fromObject(start)),
          mousePos = Vector.fromObject(action.coords);

    if (snapToGrid(mousePos).equals(startPoint)) {
      return views; // prevent zero size views
    }

    const Component = Components[typeID],
          dragPoint = Component.dragPoint(mousePos, {fixed: startPoint}),
          dragPoints = [startPoint, dragPoint];

    const tConnectors = Component.transform.getTransformedConnectors(dragPoints);
    const connectors = Component.transform.getConnectors(dragPoints);

    return {
      ...views,
      [id]: {
        typeID,
        id,
        editables: Component.defaultEditables,
        dragPoints,
        tConnectors,
        connectors,
        currentOffsets: R.repeat(STANDING_OFFSET, Component.numOfCurrentPaths),
        extraOffsets: R.repeat(0, Component.numOfCurrentPaths)
      }
    };
  }

  case MOVING_MOVED: {
    const { hoveredComponent } = action,
          { dragPointIndex } = hoveredComponent;
    if (R.is(Number, dragPointIndex) && dragPointIndex >= 0) {
      return moveSingleDragPoint(views, action);
    } else {
      return moveWholeComponent(views, action);
    }
  }

  case DELETE_COMPONENT: {
    return R.dissoc(action.id, views);
  }

  case EDIT_COMPONENT: {
    const {id, editable, value} = action;
    const view = views[id];
    return {
      ...views,
      [id]: R.assocPath(['editables', editable, 'value'], value, view)
    };
  }

  case CHANGE_COMPONENT_FREQ: {
    const {id, simTime} = action;
    const view = views[id];

    return {
      ...views,
      [id]: R.assocPath(['editables', 'frequency', 'zeroTime'], simTime, view)
    };
  }

  case SET_HOVERED_COMPONENT: {
    const { mousePos } = action;
    const viewsList = R.values(views);

    const getHoverInfo = hoverFor(mousePos);
    const toHoverInfo = view => {
      if (!view) {
        return null;
      }
      const { typeID, dragPoints } = view;
      const { hovered, dragPointIndex } = getHoverInfo(typeID, dragPoints);
      return {
        id: view.id,
        hovered,
        dragPointIndex
      };
    };

    const pickBest = R.reduce((currentBest, contender) => {
      // TODO what if a big component completely covers a smaller one?
      // - we should have a bias for smaller components
      if (!currentBest) {
        return contender;
      }
      return currentBest;
    }, toHoverInfo(R.find(isHovered, viewsList))); // prefer currently hovered view

    const hoveredComponentInfo = R.pipe(
      R.map(toHoverInfo),
      R.filter(isHovered),
      R.ifElse(moreThanOne,
        pickBest,
        R.head
      )
    )(viewsList);

    const isHoveredComponent = view => hoveredComponentInfo && view.id === hoveredComponentInfo.id;
    const unhover = mergeOverWith({hovered: false, dragPointIndex: null});

    return R.map(
      R.ifElse(isHoveredComponent,
        mergeOverWith(hoveredComponentInfo),
        unhover
      ), views);
  }

  case UPDATE_CURRENT_OFFSETS: {
    const {
      delta, // milliseconds
      currentSpeed,
      componentStates
    } = action;

    // Shamelessly stolen from Paul Falstad. I really wish I knew where these numbers came from.
    const currentMultiplier = 1.7 * delta * Math.exp(currentSpeed / 3.5 - 14.2);

    const updateExtraOffsets = view => {
      const addExtra = (current, prevExtra) => (current * currentMultiplier) + prevExtra;

      const Type = Components[view.typeID];
      const componentState = componentStates[view.id];
      const currents = Type.getCurrents(view, componentState);
      const extraOffsets = R.zipWith(addExtra, currents, view.extraOffsets);

      return {
        ...view,
        extraOffsets
      };
    };
    return R.map(updateExtraOffsets, views);
  }

  case RATIONALISE_CURRENT_OFFSETS: {
    const {
      componentStates
    } = action;

    const updateOffsets = view => {
      const addOffsets = ([current, prevOffset, additionalOffset]) => {
        if (current !== 0 && Math.abs(additionalOffset) <= .05) {
          // TODO fade out or get smaller as currents get slower than this
          // move slowly
          additionalOffset = Math.sign(additionalOffset) * .05;
        }
        else if (Math.abs(additionalOffset) > CURRENT.DOT_DISTANCE / 2) {
          // cap max offset so we don't get 'spinning wheel' problem
          additionalOffset = Math.sign(additionalOffset) * CURRENT.DOT_DISTANCE / 2;
        }

        let offset = (prevOffset + additionalOffset) % CURRENT.DOT_DISTANCE;
        if (offset < 0) {
          offset += CURRENT.DOT_DISTANCE;
        }
        return offset;
      };

      const Type = Components[view.typeID];
      const componentState = componentStates[view.id];
      const currents = Type.getCurrents(view, componentState);

      const thing = zip3(currents, view.currentOffsets, view.extraOffsets);
      const offsets = R.map(addOffsets, thing);

      return {
        ...view,
        currentOffsets: offsets,
        extraOffsets: R.repeat(0, Type.numOfCurrentPaths)
      };
    };
    return R.map(updateOffsets, views);
  }

  default: return views;
  }
}
