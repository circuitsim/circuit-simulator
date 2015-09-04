import React from 'react';
import createFragment from 'react-addons-create-fragment';
import R from 'ramda';
import CircuitComponents from '../diagram/components/All.js';

import Button from './Button.js';
import ButtonGroup from './ButtonGroup.js';
import Mouse from './art/Mouse.js';

const { PropTypes } = React;

const baseButtons = {
  select: {
    name: 'Select',
    art: Mouse
  }
};

function camelToSpace(string) {
  return R.replace(/([a-z\d])([A-Z])/g, '$1 $2', string);
}

const BUTTONS = R.reduce((buttons, component) => {
  return R.assoc(component.typeID, {
    name: camelToSpace(component.typeID),
    art: component
  }, buttons);
}, baseButtons, R.values(CircuitComponents));

const GROUPS = {
  mouse: {
    name: 'Mouse',
    buttons: ['select']
  },
  components: {
    name: 'CircuitComponents',
    buttons: R.keys(CircuitComponents)
  }
};

export default class ComponentSelector extends React.Component {

  constructor(props) {
    super(props);
    this.toButtonGroups = this.toButtonGroups.bind(this);
    this.toButtons = this.toButtons.bind(this);
  }

  getChildContext() {
    return { disableCurrent: true };
  }

  toButtons(buttonIDs) {
    const { selectedButton, onButtonClicked, theme } = this.props;
    return R.map(buttonID => {
      const props = R.pipe(
        R.assoc('id', buttonID),
        R.assoc('onClick', onButtonClicked)
      )(BUTTONS[buttonID]);
      return <Button key={ props.id } {...props} theme={ theme } selected={ selectedButton === buttonID } />;
    }, buttonIDs);
  }

  toButtonGroups(groupProperties) {
    const buttons = this.toButtons(groupProperties.buttons);

    return (
      <ButtonGroup
        key={ groupProperties.name }
        name={ groupProperties.name }
        theme={ this.props.theme }
        >
        {buttons}
      </ButtonGroup>
    );
  }

  render() {
    const groups = createFragment(R.mapObj(this.toButtonGroups, GROUPS));

    return (
      <div style={ this.props.style }>
        { groups }
      </div>
    );
  }
}

ComponentSelector.propTypes = {
  theme: PropTypes.object.isRequired,
  style: PropTypes.object,

  selectedButton: PropTypes.string.isRequired,

  onButtonClicked: PropTypes.func.isRequired
};

ComponentSelector.defaultProps = {
  selectedButton: 'select',
  onButtonClicked: (/* buttonID */) => {}
};

ComponentSelector.childContextTypes = {
  disableCurrent: React.PropTypes.bool.isRequired
};
