import R from 'ramda';
import CircuitComponents from '../components';

const lookupComponent = viewProps => CircuitComponents[viewProps.typeID];

export default function({ctx, theme, volts2RGB, circuitState, components}) {
  components.forEach((component) => {
    const ComponentType = lookupComponent(component);

    const toRGB = volts2RGB(theme.COLORS);
    const voltages = circuitState[component.id].voltages;
    const colors = component.hovered
    ? R.repeat(theme.COLORS.highlight, ComponentType.numOfVoltages || 1)
    : R.map(toRGB, voltages);

    const props = {
      ...component,
      colors
    };

    ComponentType.transform.transformCanvas(ctx, props,
      () => ComponentType.render(ctx, props)
    );
  });
}
