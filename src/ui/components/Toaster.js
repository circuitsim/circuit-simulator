import React, {PropTypes} from 'react';
import radium from 'radium';

const styles = ({COLORS}) => {
  return {
    opacity: 0.7,
    background: COLORS.canvasOverlayBackground,
    color: COLORS.highlight,
    textShadow: `0px 0px 4px #222`,
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
      <div style={styles(this.context.theme)}>
        {this.props.children}
      </div>
    );
  }
}

Toaster.propTypes = {
  children: PropTypes.string
};

Toaster.contextTypes = {
  theme: PropTypes.object
};

export default radium(Toaster);
