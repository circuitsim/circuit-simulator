import {List} from 'immutable';


const EventProcessor = function() {
  /*
   * Process a queue of events, possibly changing mode between each event.
   *
   * Returns the current mode, and a queue of actions to perform.
   *
   * @returns {Object} r
   * @returns {Mode} r.mode
   * @returns {ImmutableList} r.actions
   */
  this.process = (events, initialMode) => {
    return events.reduce((prev, event) => {
      const {mode, action} = prev.mode.handle(event);
      return {
        mode: mode || prev.mode,
        actions: action ? prev.actions.push(action) : prev.actions
      };
    }, {
      mode: initialMode,
      actions: new List()
    });
  };
};

export default EventProcessor;
