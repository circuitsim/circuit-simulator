import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Style } from 'radium';

import Sidebar from './ui/sidebar/Sidebar.js';
import CircuitDiagram from './CircuitDiagram.js';

import { componentSelectorButtonClicked } from './redux/actions.js';

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
      componentSelectorButtonClicked: onButtonClicked
    } = this.props;
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'row'
      }}>
        <Style
          rules={ styles.global }
        />
        <Sidebar
          style={ styles.side }
          onButtonClicked={ onButtonClicked } />
        <CircuitDiagram
          getDimensions={ getCanvasSize } />
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
  // ...

  // action creators
  componentSelectorButtonClicked: PropTypes.func.isRequired
};

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function mapStateToProps(/*state*/) {
  return {};
}

const mapDispatchToProps = {
  componentSelectorButtonClicked
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
