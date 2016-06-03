import R from 'ramda';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Style } from 'radium';

import Sidebar from './sidebar/Sidebar.js';
import CircuitDiagram from './diagram';
import Toaster from './components/Toaster.js';

import {
  selectMode,
  deleteComponent,
  editComponent,
  changeCurrentSpeed,
  printCircuit
} from '../state/actions';

class App extends React.Component {

  getChildContext() {
    return {
      theme: this.props.theme
    };
  }

  render() {
    const {
      styles,
      getCanvasSize,
      selectedComponent,
      showAddToaster,
      currentSpeed,
      selectMode: handleSelectMode,
      onDeleteComponent: handleDelete,
      oneditComponent: handleeditComponent,
      onChangeCurrentSpeed: handleChangeCurrentSpeed,
      onPrintCircuit: handlePrintCircuit
    } = this.props;
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'row'
      }}>
        <Style
          rules={styles.global}
        />
        <Sidebar
          style={styles.side}
          onSelectMode={handleSelectMode}
          currentSpeed={currentSpeed}
          selectedComponent={selectedComponent}
          onDeleteComponent={handleDelete}
          oneditComponent={handleeditComponent}
          onChangeCurrentSpeed={handleChangeCurrentSpeed}
          onPrintCircuit={handlePrintCircuit}
        />
        <CircuitDiagram
          getDimensions={ getCanvasSize }
        />
        <Toaster show={showAddToaster}>
          {"Click and drag on the canvas to create a component"}
        </Toaster>
      </div>
    );
  }
}

App.childContextTypes = {
  theme: React.PropTypes.object
};

App.propTypes = {
  styles: PropTypes.shape({
    global: PropTypes.object,
    side: PropTypes.object
  }).isRequired,
  theme: PropTypes.object.isRequired,
  getCanvasSize: PropTypes.func.isRequired,

  /* Injected by redux */
  // state
  selectedComponent: PropTypes.shape({
    typeID: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    editables: PropTypes.object
  }),
  showAddToaster: PropTypes.bool,
  currentSpeed: PropTypes.number,

  // action creators
  selectMode: PropTypes.func.isRequired,
  onDeleteComponent: PropTypes.func.isRequired,
  oneditComponent: PropTypes.func.isRequired,
  onChangeCurrentSpeed: PropTypes.func.isRequired,
  onPrintCircuit: PropTypes.func.isRequired
};

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function mapStateToProps({ showAddToaster, selected, currentSpeed, views }) {
  const fullSelectedComponent = views[selected];
  const selectedComponent = fullSelectedComponent
    ? R.pick(['typeID', 'id', 'editables'], fullSelectedComponent)
    : null;
  return {
    showAddToaster,
    selectedComponent,
    currentSpeed
  };
}

const mapDispatchToProps = {
  selectMode,
  onDeleteComponent: deleteComponent,
  oneditComponent: editComponent,
  onChangeCurrentSpeed: changeCurrentSpeed,
  onPrintCircuit: printCircuit
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
