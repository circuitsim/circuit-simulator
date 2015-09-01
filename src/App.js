import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Style } from 'radium';

import ComponentSelector from 'circuitsim-component-selector';
import CircuitDiagram from '../src/CircuitDiagram.js';

import { componentSelectorButtonClicked } from './actions.js';

class App extends Component {
  render() {
    const styles = this.props.styles,
          theme = this.props.theme,
          canvasDimensions = this.props.canvasDimensions;
    return (
      <div>
        <Style
          rules={ styles.global }
        />
        <ComponentSelector
          theme={ theme } // TODO put theme in context? or is this a silly idea?
          style={ styles.side }
          onButtonClicked={ this.props.componentSelectorButtonClicked }
          selectedButton={ this.props.selectedButton } />
        <CircuitDiagram
          theme={ theme }
          style={ styles.main }
          width={ canvasDimensions.width }
          height={ canvasDimensions.height } />
      </div>
    );
  }
}

App.propTypes = {
  styles: PropTypes.shape({
    global: PropTypes.object,
    main: PropTypes.object,
    side: PropTypes.object
  }).isRequired,
  theme: PropTypes.object.isRequired,
  canvasDimensions: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number
  }).isRequired,

  /* Injected by redux */
  // state
  selectedButton: PropTypes.shape({
    group: PropTypes.string.isRequired,
    button: PropTypes.string.isRequired
  }).isRequired,

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
