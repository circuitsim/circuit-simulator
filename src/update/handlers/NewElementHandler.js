// import EventTypes from '../EventTypes.js';
//
// // TODO these commands shouldn't be stored by the executor
//
// const HighlightElementCommand = function(elemID) {
//   this.do = (state) => {
//   };
//   this.undo = (state) => {
//   };
// };
//
// const handlers = {
//   [EventTypes.ElemMouseOver]: (elemID) => new HighlightElementCommand(elemID),
//   [EventTypes.ElemMouseLeave]: (elemID) => new UnhighlightElementCommand(elemID)
// };
//
// const handleHover = (event) => {
//   const handler = handlers[event.type];
//   return {
//     command: handler ? handler(event.elemID) : null
//   };
// };
//
// export default handleHover;
