import React from 'react';

import EventTypes from '../update/EventTypes.js';
import Colors from '../styles/Colors.js';
import {makeArtListener} from './utils/DrawingUtils.js';

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
      this.push = this.push.bind(this);
    }

    push(event) {
      this.props.pushEvent({
        event,
        type: event.type === 'mouseover' ? EventTypes.ElemMouseOver : EventTypes.ElemMouseLeave,
        elemID: this.refs.elem.props.id
      });
    }

    render() {
      const handlers = {
              mouseOver: makeArtListener(this.push),
              mouseOut: makeArtListener(this.push)
            },
            color = this.props.hover ? Colors.theme : Colors.base;

      return (
        <CircuitElement ref='elem'
          {...this.props}
          color={color}
          handlers={handlers}
        />
      );
    }
  }

  Highlighter.propTypes = {
    hover: React.PropTypes.bool,
    pushEvent: React.PropTypes.func.isRequired
  };

  Highlighter.defaultProps = {
    hover: false
  };

  return Highlighter;
};
