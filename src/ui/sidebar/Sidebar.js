import R from 'ramda';
import React from 'react';
import ComponentSelector from './component-selection/ComponentSelector.js';
import ComponentInspector from './component-inspection/ComponentInspector.js';
import CurrentSpeed from './CurrentSpeed';
import Button from '../components/Button';

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
  shouldComponentUpdate(nextProps) {
    const {
      currentSpeed,
      selectedComponent
    } = this.props;

    if (currentSpeed !== nextProps.currentSpeed) {
      return true;
    }

    if (!R.equals(selectedComponent, nextProps.selectedComponent)) {
      return true;
    }

    return false;
  }

  render() {
    const {
      style,
      selectedComponent,
      currentSpeed,
      onSelectMode: handleSelectMode,
      onDeleteComponent: handleDelete,
      oneditComponent: handleeditComponent,
      onChangeCurrentSpeed: handleChangeCurrentSpeed,
      onPrintCircuit: handlePrintCircuit
    } = this.props;
    return (
      <div style={style}>
        <ComponentSelector style={styles.selector}
          onButtonClicked={handleSelectMode}
        />
        {__DEV__ ? <Button onClick={handlePrintCircuit}>Print</Button> : null}
        <CurrentSpeed value={currentSpeed} onChange={handleChangeCurrentSpeed} />
        <ComponentInspector style={styles.inspector}
          selectedComponent={selectedComponent}
          onDeleteComponent={handleDelete}
          oneditComponent={handleeditComponent}
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

  selectedComponent: PropTypes.shape({
    typeID: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    editables: PropTypes.object
  }),

  onDeleteComponent: PropTypes.func.isRequired,
  oneditComponent: PropTypes.func.isRequired,
  onChangeCurrentSpeed: PropTypes.func.isRequired,
  onPrintCircuit: PropTypes.func.isRequired
};
