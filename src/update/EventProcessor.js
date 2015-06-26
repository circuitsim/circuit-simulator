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
    return events.reduce(({mode, actions}, event) => {
      const {mode: nextMode, action} = mode.handle(event);
      return {
        mode: nextMode || mode,
        actions: action ? actions.push(action) : actions
      };
    }, {
      mode: initialMode,
      actions: new List()
    });
  };
};

export default EventProcessor;
