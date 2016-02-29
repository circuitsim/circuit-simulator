import React, {PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import radium from 'radium';

const styles = ({COLORS}) => {
  return {
    background: COLORS.canvasOverlayBackground,
    color: COLORS.highlight,
    textShadow: '0px 0px 4px #222',
    fontSize: 'larger',
    position: 'absolute',
    right: '2em',
    top: '2em',
    padding: '10px',
    maxWidth: '10em',
    borderRadius: '5px',
    pointerEvents: 'none'
  };
};

class Toaster extends React.Component {

  render() {
    return (
      <ReactCSSTransitionGroup transitionName='toaster'
        transitionEnterTimeout={100}
        transitionLeaveTimeout={70}
      >
        { this.props.show
          ?
          <div style={styles(this.context.theme)} key={'toaster'} className='toaster'>
            {this.props.children}
          </div>
          :
          null
        }
      </ReactCSSTransitionGroup>
    );
  }
}

Toaster.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.string
};

Toaster.contextTypes = {
  theme: PropTypes.object
};

export default radium(Toaster);
