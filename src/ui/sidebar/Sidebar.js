import React from 'react';
import ComponentSelector from './component-selection/ComponentSelector.js';
import ComponentInspector from './component-inspection/ComponentInspector.js';
import CurrentSpeed from './CurrentSpeed';

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
      currentSpeed,
      onSelectMode: handleSelectMode,
      onDeleteComponent: handleDelete,
      onChangeComponentOption: handleChangeComponentOption,
      onChangeCurrentSpeed: handleChangeCurrentSpeed
    } = this.props;
    return (
      <div style={style}>
        <ComponentSelector style={styles.selector}
          onButtonClicked={handleSelectMode}
        />
        <CurrentSpeed value={currentSpeed} onChange={handleChangeCurrentSpeed} />
        <ComponentInspector style={styles.inspector}
          selectedComponent={selectedComponent}
          onDeleteComponent={handleDelete}
          onChangeComponentOption={handleChangeComponentOption}
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

  currentSpeed: PropTypes.number.isRequired,

  selectedComponent: PropTypes.object,
  onDeleteComponent: PropTypes.func.isRequired,
  onChangeComponentOption: PropTypes.func.isRequired,
  onChangeCurrentSpeed: PropTypes.func.isRequired
};
