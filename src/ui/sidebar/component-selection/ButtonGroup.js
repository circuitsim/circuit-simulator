import React from 'react';
import R from 'ramda';

function styles({ STYLES }) {
  return {
    group: {
      margin: '10px 0px'
    },
    buttons: {
      display: 'flex',
      justifyContent: 'flex-start',
      flexWrap: 'wrap',
      alignItems: 'baseline'
    },
    title: R.merge(STYLES.title, {paddingLeft: '5px'})
  };
}

const ButtonGroup = ({ name, children }, { theme }) => {
  const style = styles(theme);
  return (
    <div style={style.group} >
      <div style={style.title} >{name}</div>
      <div style={style.buttons} >
        {children}
      </div>
    </div>
  );
};

ButtonGroup.propTypes = {
  name: React.PropTypes.string,
  children: React.PropTypes.array.isRequired
};

ButtonGroup.contextTypes = {
  theme: React.PropTypes.object
};

export default ButtonGroup;
