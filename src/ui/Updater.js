import R from 'ramda';
import {
  canvasMouseDown,
  canvasMouseMove,
  canvasMouseUp,
  canvasMouseEnter,
  canvasMouseLeave,

  loopBegin,
  loopUpdate
} from '../state/actions';

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
        circuitState: state.circuit.components,
        hover: state.hover,
        handlers: {
          canvas: {
            onMouseDown: coords => store.dispatch(canvasMouseDown(coords)),
            onMouseMove: coords => store.dispatch(canvasMouseMove(coords)),
            onMouseUp: coords => store.dispatch(canvasMouseUp(coords)),
            onMouseEnter: () => store.dispatch(canvasMouseEnter()),
            onMouseLeave: () => store.dispatch(canvasMouseLeave())
          }
        },
        circuitError: state.circuit.error,
        volts2RGB: state.circuit.volts2RGB
      }
    };
  }

  return {
    begin,
    update
  };
}

export default Updater;
