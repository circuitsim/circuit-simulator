import React from 'react';
import parseunit from 'parseunit';

function styles({ TYPOGRAPHY, COLORS }) {
  const [ val, unit ] = parseunit(TYPOGRAPHY.lineHeight);

  return {
    title: {
      lineHeight: `${val * 1.5}${unit}`,
      paddingLeft: '5px',
      fontSize: 'larger',
      color: COLORS.highlight
    }
  };
}

const ButtonGroup = ({theme, name, children}) => (
  <div>
    <div style={styles(theme).title} >{name}</div>
    {children}
  </div>
);

ButtonGroup.propTypes = {
  name: React.PropTypes.string,
  theme: React.PropTypes.object.isRequired,
  children: React.PropTypes.array.isRequired
};

export default ButtonGroup;
