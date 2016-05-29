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

class OptionSelector extends React.Component {

  constructor(props) {
    super(props);
    this.onValueChange = this.onValueChange.bind(this);
  }

  onValueChange(value) {
    const { option } = this.props;
    this.props.onChangeValue(option, value);
  }

  render() {
    const { options, value } = this.props;
    const styles = getStyles(this.context.theme);
    return (
      <div style={styles.outer}>
        {R.map((option) => {
          const style = option === value
            ? R.merge(styles.options, styles.selected)
            : styles.options;
          return (
            <div
              key={option}
              style={style}
              onClick={() => this.onValueChange(option)}
            >
              {option}
            </div>
          );
        }, options)}
      </div>
    );
  }
}

OptionSelector.propTypes = {
  option: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,

  options: PropTypes.arrayOf(PropTypes.string),

  onChangeValue: PropTypes.func.isRequired
};

OptionSelector.contextTypes = {
  theme: PropTypes.object.isRequired
};

export default radium(OptionSelector);
