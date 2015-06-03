import React from 'react';

import Colors from '../styles/Colors.js';

import {makeArtListener, PropTypes} from './utils/DrawingUtils.js';

/**
 * @example
 * import handleHover from '...HighlightOnHover.jsx';
 * const myHoveringElem = handlerHover(MyCircuitElement);
 *
 * @param  {CircuitElement}
 */
export default CircuitElement => {
  class Highlighter extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        color: props.adding ? Colors.trans(Colors.base) : Colors.base
      };
      this.highlight = this.highlight.bind(this);
      this.unHighlight = this.unHighlight.bind(this);
    }

    highlight() {
      this.setState({color: Colors.theme});
    }

    unHighlight() {
      this.setState({color: Colors.base});
    }

    render() {
      const {handlers} = this.props,
            allHandlers = Object.assign({
              mouseOver: makeArtListener(this.highlight),
              mouseOut: makeArtListener(this.unHighlight)
            }, handlers);

      return (
        <CircuitElement
          {...this.props}
          {...this.state}
          handlers={allHandlers}
        />
      );
    }
  }

  Highlighter.propTypes = {
    adding: React.PropTypes.bool,
    handlers: React.PropTypes.shape({
      mouseOver: PropTypes.ArtListener,
      mouseOut: PropTypes.ArtListener
    })
  };

  Highlighter.defaultProps = {
    adding: false
  };

  return Highlighter;
};
