import React from 'react';
import parseunit from 'parseunit';

function styles({ TYPOGRAPHY, COLORS }) {
  const [ val, unit ] = parseunit(TYPOGRAPHY.lineHeight);

  return {
    group: {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap'
    },
    title: {
      lineHeight: `${val * 1.5}${unit}`,
      paddingLeft: '5px',
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
    <div>
      <div style={style.title} >{name}</div>
      <div style={style.group} >
        {children}
      </div>
    </div>
  );
};

ButtonGroup.propTypes = {
  name: React.PropTypes.string,
  theme: React.PropTypes.object.isRequired,
  children: React.PropTypes.array.isRequired
};

export default ButtonGroup;
