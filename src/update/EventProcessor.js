import List from 'immutable';


const EventProcessor = function() {
  /*
   * Process a queue of events, possibly changing mode between each event.
   *
   * Returns the current mode, and a queue of commands to run.
   *
   * @returns {Object} r
   * @returns {function} r.mode
   * @returns {ImmutableList} r.commands
   */
  this.process = (events, initialMode) => {
    return events.reduce((prev, event) => {
      const {mode, command} = prev.mode(event);
      return {
        mode: mode || prev.mode,
        commands: command ? prev.commands.push(command) : prev.commands
      };
    }, {
      mode: initialMode,
      commands: new List()
    });
  };
};

export default EventProcessor;
