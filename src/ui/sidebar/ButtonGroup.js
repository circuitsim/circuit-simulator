import React from 'react';
import parseunit from 'parseunit';

function styles({ TYPOGRAPHY, COLORS }) {
  const [ val, unit ] = parseunit(TYPOGRAPHY.lineHeight);

  return {
    group: {
      marginTop: '10px'
    },
    title: {
      lineHeight: `${val * 1.5}${unit}`,
      paddingLeft: '10px',
      fontWeight: 'bold',
      fontSize: 'smaller',
      textTransform: 'uppercase',
      color: COLORS.semiHighlight
    }
  };
}

const ButtonGroup = ({theme, name, children}) => {
  const style = styles(theme);
  return (
    <div style={style.group} >
      <div style={style.title} >{name}</div>
      {children}
    </div>
  );
};

ButtonGroup.propTypes = {
  name: React.PropTypes.string,
  theme: React.PropTypes.object.isRequired,
  children: React.PropTypes.array.isRequired
};

export default ButtonGroup;
