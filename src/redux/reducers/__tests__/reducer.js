import mainLoopReducer from '../mainLoop';
import { RC_CIRCUIT } from './CircuitData';
import { LOOP_BEGIN, LOOP_UPDATE } from '../../actions';
import R from 'ramda';

const { views } = RC_CIRCUIT;
const {Resistor, Capacitor} = views;
const TIME_CONSTANT = Resistor.value * Capacitor.value;

const BEGIN_ACTION = {
  type: LOOP_BEGIN,
  views
};
const UPDATE_ACTION = {
  type: LOOP_UPDATE,
  delta: TIME_CONSTANT
};

describe('Solving an RC circuit', () => {

  let state;
  beforeEach(() => {
    const initialState = mainLoopReducer(undefined, {});
    const modState = R.merge(initialState, {
      circuitChanged: true,
      simTimePerSec: 1
    });
    const postBeginState = mainLoopReducer(modState, BEGIN_ACTION);
    state = mainLoopReducer(postBeginState, UPDATE_ACTION);
  });

  it('should accurately model capacitor decay over time', () => {
    const {components} = state;
    const capacitorVoltage = components.Capacitor.voltages[0];

    const EXPECTED = 1.839;
    const SIX_PERCENT = EXPECTED * 0.06; // yeah...
    expect(capacitorVoltage).to.be.within(EXPECTED - SIX_PERCENT, EXPECTED + SIX_PERCENT);
  });
});
