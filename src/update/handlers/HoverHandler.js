import EventTypes from '../EventTypes.js';

const HighlightElementAction = function(elemID) {
  this.do = (state) => {
    // this has access to ALL state (which is currently mutable) - pretty bad`
    state.elements.get(elemID).props.hover = true;
    return state;
  };
};

const UnhighlightElementAction = function(elemID) {
  this.do = (state) => {
    state.elements.get(elemID).props.hover = false;
    return state;
  };
};

const handlers = {
  [EventTypes.ElemMouseOver]: (elemID) => new HighlightElementAction(elemID),
  [EventTypes.ElemMouseLeave]: (elemID) => new UnhighlightElementAction(elemID)
};

const handleHover = (event) => {
  const handler = handlers[event.type];
  return {
    command: handler ? handler(event.elemID) : null
  };
};

export default handleHover;
