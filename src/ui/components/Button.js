import React from 'react';
import radium from 'radium';
import Color from 'color';

const { PropTypes } = React;

const lighten = (s, by = 0.1) => new Color(s).lighten(by).rgbString();
const darken = (s, by = 0.1) => new Color(s).darken(by).rgbString();

const backgroundColors = COLORS => ({
  normal: [
    COLORS.buttonBackground1,
    COLORS.buttonBackground2
  ],
  danger: [
    COLORS.danger,
    COLORS.danger
  ]
});

function styles({COLORS}, danger = false) {
  const bg = backgroundColors(COLORS)[danger ? 'danger' : 'normal'];
  const color = danger ? COLORS.highlight : COLORS.base;
  return {
    button: {
      border: 'none',
      borderRadius: '4px',
      background: `linear-gradient(${bg[0]}, ${bg[1]})`,
      color,
      boxShadow: `0 3px ${lighten(bg[0], 0.3)}`,
      minWidth: '6em',
      minHeight: '2em',
      padding: '1px 5px',
      verticalAlign: 'top',

      ':focus': {
        outline: 'none'
      },
      ':hover': {
        background: `linear-gradient(${darken(bg[0])}, ${darken(bg[1])})`,
        boxShadow: `0 3px ${lighten(bg[0], 0.1)}`
      },
      ':active': {
        boxShadow: `0 2px ${lighten(bg[0], 0.1)}`,
        transform: 'translateY(1px)'
      }
    }
  };
}

class Button extends React.Component {
  render() {
    const { onClick, children, danger } = this.props;
    const { theme } = this.context;
    const style = styles(theme, danger);
    return (
      <button style={[style.button, this.props.style]}
        type='button'
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node,
  danger: PropTypes.bool,

  style: PropTypes.object
};

Button.contextTypes = {
  theme: PropTypes.object
};

export default radium(Button);
