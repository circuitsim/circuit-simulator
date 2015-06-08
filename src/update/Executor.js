const Executor = function() {
  // TODO maximum stack size?
  const undoStack = [];
  const redoStack = [];

  this.execute = (command, state) => {
    if (command.undo) {
      undoStack.push(command); // some commands, like highlighting, shouldn't be added to the undo stack
    }
    return command.do(state);
  };
  this.executeAll = (commands, initialState) => {
    return commands.reduce((state, command) => {
      return this.execute(command, state);
    },
    initialState);
  };
  this.undo = () => {
    const command = undoStack.pop();
    if (command) {
      redoStack.push(command);
      return command.undo();
    }
  };
  this.redo = () => {
    const command = redoStack.pop();
    if (command) {
      undoStack.push(command);
      return command.do();
    }
  };
};

export default Executor;
