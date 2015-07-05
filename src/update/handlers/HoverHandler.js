import EventTypes from '../EventTypes.js';

const HighlightElementAction = function(elemID) {
  this.do = (state) => {
    return state.updateIn(['views', elemID, 'props', 'hover'], () => true);
  };
};

const UnhighlightElementAction = function(elemID) {
  this.do = (state) => {
    return state.updateIn(['views', elemID, 'props', 'hover'], () => false);
  };
};

const handlers = {
  [EventTypes.ElemMouseOver]: (elemID) => new HighlightElementAction(elemID),
  [EventTypes.ElemMouseLeave]: (elemID) => new UnhighlightElementAction(elemID)
};

const handleHover = (event) => {
  const handler = handlers[event.type];
  return handler ? {
    action: handler(event.elemID)
  } : null; // would a Maybe type be nicer?
};

export default handleHover;
