import EventTypes from '../EventTypes.js';

const HighlightElementAction = function(elemID) {
  this.do = (state) => {
    // this is a bit nasty...
    const elem = state.getIn(['elements', elemID]);
    elem.props.hover = true;
    return state.setIn(['elements', elemID], elem);
  };
};

const UnhighlightElementAction = function(elemID) {
  this.do = (state) => {
    const elem = state.getIn(['elements', elemID]);
    elem.props.hover = false;
    return state.setIn(['elements', elemID], elem);
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
