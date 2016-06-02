import mainLoopReducer from '../mainLoop';
import { RC_CIRCUIT } from './CircuitData';
import { LOOP_BEGIN, LOOP_UPDATE } from '../../actions';
import {merge} from 'ramda';

const { views } = RC_CIRCUIT;
const {VoltageSource, Resistor, Capacitor} = views;
const V = VoltageSource.editables.voltage.value;
const R = Resistor.editables.resistance.value;
const C = Capacitor.editables.capacitance.value;
const TIME_CONSTANT = R * C;
const t = TIME_CONSTANT;

// expectations after time = t
const Ir = (V / R) * Math.exp(-t / TIME_CONSTANT); // current through resistor and capacitor
const Qc = C * V * (1 - Math.exp(-t / TIME_CONSTANT)); // charge on capacitor
const Vc = Qc / C; // voltage across capacitor

const BEGIN_ACTION = {
  type: LOOP_BEGIN,
  views
};
const UPDATE_ACTION = {
  type: LOOP_UPDATE,
  delta: TIME_CONSTANT * 1000 // from seconds to milliseconds
};

describe('Solving an RC circuit over time where: t = time constant', () => {

  let state;
  before(() => {
    const initialState = mainLoopReducer(undefined, {});
    const modState = merge(initialState, {
      circuitChanged: true,
      simTimePerSec: 1
    });
    const postBeginState = mainLoopReducer(modState, BEGIN_ACTION);
    state = mainLoopReducer(postBeginState, UPDATE_ACTION);
  });

  it('should model the charging current through the resistor', () => {
    const {components} = state;
    const [v0, v1] = components.Resistor.voltages;
    const resistorCurrent = (v0 - v1) / R;

    const TWO_PERCENT = Ir * 0.02;
    expect(resistorCurrent).to.be.within(Ir - TWO_PERCENT, Ir + TWO_PERCENT);
  });

  it('should model the charging current through the capacitor', () => {
    const {components} = state;
    const capacitorCurrent = components.Capacitor.currents[0];

    const TWO_PERCENT = Ir * 0.02;
    expect(capacitorCurrent).to.be.within(Ir - TWO_PERCENT, Ir + TWO_PERCENT);
  });

  it('should model the capacitor voltage', () => {
    const {components} = state;
    const capacitorVoltage = components.Capacitor.voltages[0];

    const TWO_PERCENT = Vc * 0.02;
    expect(capacitorVoltage).to.be.within(Vc - TWO_PERCENT, Vc + TWO_PERCENT);
  });
});
