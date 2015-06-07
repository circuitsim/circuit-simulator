
const EventProcessor = function() {
  /*
   * Process a queue of events, possibly changing mode between each event.
   *
   * Returns the current mode, and a queue of commands to run.
   *
   * @returns {Object} r
   * @returns {string} r.mode
   * @returns {array} r.commands
   */
  this.process = (events, initialMode) => {
    return events.reduce((acc, event) => {
      const {mode, command} = acc.mode(event);
      if (command) { acc.commands.push(command); }
      return {
        mode: mode || acc.mode,
        commands: acc.commands
      };
    }, {
      mode: initialMode,
      commands: []
    });
  };
};

export default EventProcessor;
