import React from 'react';
import radium from 'radium';
import R from 'ramda';

const { PropTypes } = React;

const getStyles = ({COLORS}) => ({
  outer: {
    padding: '10px 0px',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around'
  },
  options: {
    // flexGrow: 1
    cursor: 'pointer'
  },
  selected: {
    color: COLORS.theme
  }
});

class TypeSelector extends React.Component {

  constructor(props) {
    super(props);
    this.onValueChange = this.onValueChange.bind(this);
  }

  onValueChange(value) {
    const { editable } = this.props;
    this.props.onChangeValue(editable, value);
  }

  render() {
    const { options, value } = this.props;
    const styles = getStyles(this.context.theme);
    return (
      <div style={styles.outer}>
        {R.map((editable) => {
          const style = editable === value
            ? R.merge(styles.options, styles.selected)
            : styles.options;
          return (
            <div
              key={editable}
              style={style}
              onClick={() => this.onValueChange(editable)}
            >
              {editable}
            </div>
          );
        }, options)}
      </div>
    );
  }
}

TypeSelector.propTypes = {
  editable: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,

  options: PropTypes.arrayOf(PropTypes.string),

  onChangeValue: PropTypes.func.isRequired
};

TypeSelector.contextTypes = {
  theme: PropTypes.object.isRequired
};

export default radium(TypeSelector);
