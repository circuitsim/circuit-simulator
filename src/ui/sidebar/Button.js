import React from 'react';
import radium from 'radium';
import R from 'ramda';
import parseunit from 'parseunit';

import ArtWrapper from './ArtWrapper.js';

function styles({COLORS, TYPOGRAPHY}) {
  const imgSize = 50;
  const [lhVal, lhUnits] = parseunit(TYPOGRAPHY.lineHeight);
  return {
    button: {
      padding: 0,
      border: 'none',
      width: imgSize + 'px',
      ':hover': {}
    },
    img: {
      height: imgSize + 'px',
      width: imgSize + 'px',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    label: {
      height: `${2 * lhVal}${lhUnits}`,
      display: 'inline-block',
      verticalAlign: 'top'
    },
    base: {
      color: COLORS.base
    },
    hover: {
      color: COLORS.highlight
    },
    selected: {
      color: COLORS.theme
    }
  };
}

class Button extends React.Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.onClick(this.props.id);
  }

  render() {
    const Art = this.props.art;
    const styled = styles(this.props.theme);
    const labelColor = radium.getState(this.state, 'button', ':hover')
        ? styled.hover
        : styled.base;
    const imgColor = this.props.selected
      ? styled.selected
      : labelColor;

    return (
      <button
        key='button'
        onClick={this.onClick}
        style={styled.button}
        type='button'
        name={this.props.name}
        value={this.props.name}>

        <div style={styled.img}>
          <ArtWrapper
            art={Art}
            theme={this.props.theme}
            colors={R.repeat(imgColor.color, Art.numOfVoltages || 1)}
          />
        </div>

        <span style={[styled.label, labelColor]}>
          {this.props.name}
        </span>
      </button>
    );
  }
}

Button.propTypes = {
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  art: React.PropTypes.any.isRequired,
  selected: React.PropTypes.bool,
  theme: React.PropTypes.object.isRequired,

  onClick: React.PropTypes.func.isRequired
};

Button.defaultProps = {
  selected: false
};

export default radium(Button);
