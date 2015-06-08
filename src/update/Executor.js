const Executor = function() {
  // TODO maximum stack size?
  const undoStack = [];
  const redoStack = [];

  this.execute = (action, state) => {
    if (action.undo) {
      undoStack.push(action); // some actions, like highlighting, shouldn't be added to the undo stack
    }
    return action.do(state);
  };
  this.executeAll = (actions, initialState) => {
    return actions.reduce((state, action) => {
      return this.execute(action, state);
    },
    initialState);
  };
  this.undo = () => {
    const action = undoStack.pop();
    if (action) {
      redoStack.push(action);
      return action.undo();
    }
  };
  this.redo = () => {
    const action = redoStack.pop();
    if (action) {
      undoStack.push(action);
      return action.do();
    }
  };
};

export default Executor;
