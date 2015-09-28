import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Style } from 'radium';

import Sidebar from './ui/sidebar/Sidebar.js';
import CircuitDiagram from './CircuitDiagram.js';

import { componentSelectorButtonClicked } from './redux/actions.js';

const App = props => {
  const {
    styles,
    theme,
    getCanvasSize,
    selectedButton,
    componentSelectorButtonClicked: onButtonClicked
  } = props;
  return (
    <div>
      <Style
        rules={ styles.global }
      />
      <Sidebar
        theme={ theme } // TODO put theme in context? or is this a silly idea?
        style={ styles.side }
        onButtonClicked={ onButtonClicked }
        selectedButton={ selectedButton } />
      <CircuitDiagram
        theme={ theme }
        style={ styles.main }
        getDimensions={ getCanvasSize } />
    </div>
  );
};

App.propTypes = {
  styles: PropTypes.shape({
    global: PropTypes.object,
    main: PropTypes.object,
    side: PropTypes.object
  }).isRequired,
  theme: PropTypes.object.isRequired,
  getCanvasSize: PropTypes.func.isRequired,

  /* Injected by redux */
  // state
  selectedButton: PropTypes.string.isRequired,

  // action creators
  componentSelectorButtonClicked: PropTypes.func.isRequired
};

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function mapStateToProps(state) {
  return {
    selectedButton: state.selectedButton
  };
}

const mapDispatchToProps = {
  componentSelectorButtonClicked
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
