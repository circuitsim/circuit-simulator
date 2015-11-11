import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Style } from 'radium';

import Sidebar from './sidebar/Sidebar.js';
import CircuitDiagram from './diagram';
import Toaster from './components/Toaster.js';

import {
  selectMode,
  deleteComponent,
  changeComponentValue
} from '../redux/actions.js';

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
      selectMode: handleSelectMode,
      onDeleteComponent: handleDelete,
      onChangeComponentValue: handleChangeComponentValue
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
          selectedComponent={selectedComponent}
          onDeleteComponent={handleDelete}
          onChangeComponentValue={handleChangeComponentValue}
        />
        <CircuitDiagram
          getDimensions={ getCanvasSize }
        />
        {showAddToaster
          ?
          <Toaster>
            {"Click and drag on the canvas to create a component"}
          </Toaster>
          :
          null
        }
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
    props: PropTypes.shape({
      value: PropTypes.number
    }).isRequired
  }),
  showAddToaster: PropTypes.bool,

  // action creators
  selectMode: PropTypes.func.isRequired,
  onDeleteComponent: PropTypes.func.isRequired,
  onChangeComponentValue: PropTypes.func.isRequired
};

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function mapStateToProps({ showAddToaster, selected }) {
  return {
    showAddToaster,
    selectedComponent: selected
  };
}

const mapDispatchToProps = {
  selectMode,
  onDeleteComponent: deleteComponent,
  onChangeComponentValue: changeComponentValue
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
