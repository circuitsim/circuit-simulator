import React, {PropTypes} from 'react';
import radium from 'radium';

const styles = ({COLORS, trans}) => {
  const background = trans(COLORS.canvasOverlayBackground);
  const color = trans(COLORS.semiHighlight, 0.2);
  return {
    background,
    color,
    position: 'absolute',
    right: '2em',
    bottom: '2em',
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
