import React from 'react';
import { Utils } from 'circuitsim-art-utils';

const { makeArtListener } = Utils;

function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

/**
 * @example
 * import handleHover from '...HighlightOnHover.js';
 * const myHoveringElem = handlerHover(MyCircuitElement);
 *
 * @param  {CircuitElement}
 */
export default CircuitElement => {
  class Highlighter extends React.Component {

    constructor(props) {
      super(props);
      this.onMouse = this.onMouse.bind(this);
    }

    onMouse(event) {
      const elemID = this.refs.elem.props.id;
      const handlers = this.props.handlers;

      switch (event.type) {
      case 'mouseover':
        handlers.onMouseOver(elemID);
        break;
      case 'mouseout':
        handlers.onMouseOut(elemID);
        break;
      }
    }

    render() {
      const COLORS = this.props.theme.COLORS,
            color = this.props.hover ? COLORS.highlight : COLORS.base;

      return (
        <CircuitElement ref='elem'
          {...this.props}
          color={color}
          onMouseOver={makeArtListener(this.onMouse)}
          onMouseOut={makeArtListener(this.onMouse)}
        />
      );
    }
  }

  Highlighter.propTypes = {
    hover: React.PropTypes.bool,
    theme: React.PropTypes.object.isRequired,

    handlers: React.PropTypes.shape({
      onMouseOver: React.PropTypes.func.isRequired,
      onMouseOut: React.PropTypes.func.isRequired
    }).isRequired
  };

  Highlighter.defaultProps = {
    hover: false
  };

  Highlighter.displayName = `Highlighted(${getDisplayName(CircuitElement)})`;

  return Highlighter;
};
