import R from 'ramda';
import {
  canvasMouseDown,
  canvasMouseMove,
  canvasMouseUp,

  loopBegin,
  loopUpdate
} from '../redux/actions.js';

/* Special object that reads state from store when update() is called,
  rather than subscribing to store changes. */
function Updater(store) {

  function begin() {
    store.dispatch(loopBegin());
  }

  // uses previous state + delta to calculate new props for CircuitCanvas
  function update(delta) {

    store.dispatch(loopUpdate(delta));

    const state = store.getState();

    return {
      props: {
        circuitComponents: R.values(state.views),
        hover: state.hover,
        handlers: {
          canvas: {
            onMouseDown: coords => store.dispatch(canvasMouseDown(coords)),
            onMouseMove: coords => store.dispatch(canvasMouseMove(coords)),
            onMouseUp: coords => store.dispatch(canvasMouseUp(coords))
          }
        },
        circuitError: state.error,
        currentOffset: state.currentOffset,
        volts2RGB: state.volts2RGB
      }
    };
  }

  return {
    begin,
    update
  };
}

export default Updater;
