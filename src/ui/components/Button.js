import React from 'react';
import radium from 'radium';
import Color from 'color';

const { PropTypes } = React;

const lighten = s => new Color(s).lighten(0.2).rgbString();
const darken = s => new Color(s).darken(0.2).rgbString();

function styles({COLORS}) {
  return {
    button: {
      border: 'none',
      borderRadius: '2px',
      background: `linear-gradient(${COLORS.buttonBackground1}, ${COLORS.buttonBackground2})`,
      color: COLORS.base,
      textShadow: `1px 1px 2px ${COLORS.baseShadow}`,
      boxShadow: [
        `1px 1px 1px 0px ${COLORS.transBlack}`,
        `inset 2px 3px 2px -2px ${COLORS.boxShadow}`,
        `inset -2px -3px 2px -2px ${COLORS.buttonBackground2}`
      ].join(', '),
      minWidth: '6em',
      minHeight: '2em',
      padding: '1px 5px 1px 5px',
      verticalAlign: 'top',

      ':focus': {
        outline: 'none'
      },
      ':hover': {
        boxShadow: [
          `1px 1px 1px 0px ${COLORS.transBlack}`,
          `inset 2px 3px 2px -2px ${lighten(COLORS.boxShadow)}`,
          `inset -2px -3px 2px -2px ${lighten(COLORS.buttonBackground2)}`
        ].join(', '),
        color: lighten(COLORS.base),
        background: `linear-gradient(${lighten(COLORS.buttonBackground1)}, ${lighten(COLORS.buttonBackground2)})`
      },
      ':active': {
        boxShadow: [
          `inset 2px 3px 2px -2px ${darken(COLORS.buttonBackground2)}`,
          `inset -2px -3px 2px -2px ${lighten(COLORS.buttonBackground1)}`
        ].join(', '),
        background: `linear-gradient(${COLORS.buttonBackground2}, ${COLORS.buttonBackground1})`,
        padding: '3px 4px 1px 6px',
        color: COLORS.base
      }
    }
  };
}

class ComponentButton extends React.Component {
  render() {
    const { onClick, children } = this.props;
    const { theme } = this.context;
    return (
      <button style={styles(theme).button}
        type='button'
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
}

ComponentButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node
};

ComponentButton.contextTypes = {
  theme: PropTypes.object
};

export default radium(ComponentButton);
