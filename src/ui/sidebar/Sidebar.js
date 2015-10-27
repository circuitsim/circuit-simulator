import React from 'react';
import ComponentSelector from './component-selection/ComponentSelector.js';
import ComponentInspector from './component-inspection/ComponentInspector.js';

const { PropTypes } = React;

const styles = {
  selector: {
    flexGrow: 4
  },
  inspector: {
    minHeight: '5em'
  },
  footer: {
    alignSelf: 'center',
    paddingTop: '5px'
  }
};

export default class Sidebar extends React.Component {
  render() {
    const {
      style,
      selectedComponent,
      onSelectMode: handleSelectMode,
      onDeleteComponent: handleDelete,
      onChangeComponentValue: handleChangeComponentValue
    } = this.props;
    return (
      <div style={style}>
        <ComponentSelector style={styles.selector}
          onButtonClicked={handleSelectMode}
        />
        <ComponentInspector style={styles.inspector}
          selectedComponent={selectedComponent}
          onDeleteComponent={handleDelete}
          onChangeComponentValue={handleChangeComponentValue}
        />
        <div style={styles.footer} >
          <span>
            Made by <a href='http://thomwright.co.uk'>Thom Wright</a> - <a href='https://github.com/circuitsim'><span className='octicon octicon-mark-github'></span></a>
          </span>
        </div>
      </div>
    );
  }
}

Sidebar.propTypes = {
  style: PropTypes.object,

  onSelectMode: PropTypes.func.isRequired,

  selectedComponent: PropTypes.object,
  onDeleteComponent: PropTypes.func.isRequired,
  onChangeComponentValue: PropTypes.func.isRequired
};
