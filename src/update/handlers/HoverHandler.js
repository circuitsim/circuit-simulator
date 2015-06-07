import EventTypes from '../EventTypes.js';

// TODO these commands shouldn't be stored by the executor

const HighlightElementCommand = function(elemID) {
  this.do = (state) => {
    // this has access to ALL state (which is currently mutable) - pretty bad`
    state.elements.get(elemID).props.hover = true;
    return state;
  };
  this.undo = (state) => {
    state.elements.get(elemID).props.hover = false;
    return state;
  };
};

const UnhighlightElementCommand = function(elemID) {
  const delegate = new HighlightElementCommand(elemID);
  this.do = delegate.undo;
  this.undo = delegate.do;
};

const handlers = {
  [EventTypes.ElemMouseOver]: (elemID) => new HighlightElementCommand(elemID),
  [EventTypes.ElemMouseLeave]: (elemID) => new UnhighlightElementCommand(elemID)
};

const handleHover = (event) => {
  const handler = handlers[event.type];
  return {
    command: handler ? handler(event.elemID) : null
  };
};

export default handleHover;
