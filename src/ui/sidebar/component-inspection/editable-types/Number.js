import React from 'react';
import radium from 'radium';
import R from 'ramda';
import {unformatSI, formatSI} from 'format-si-prefix';

const { PropTypes } = React;

const getStyles = ({COLORS}) => ({
  value: {
    outer: {
      padding: '10px 0px'
    },
    input: {
      padding: '2px',
      backgroundColor: COLORS.textInputBackground,
      color: COLORS.base,
      borderRadius: '2px',
      border: '1px solid transparent',

      ':focus': {
        border: '1px solid transparent',
        color: COLORS.semiHighlight
      }
    }
  }
});

const isOkNumber = R.allPass([
  R.is(Number),
  R.compose(R.not, Number.isNaN)
]);

const within = ({lower = -Infinity, upper = Infinity}) => (val) => val >= lower && val <= upper;

class NumericValueEditor extends React.Component {

  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      value: value ? formatSI(value) : undefined
    };
    this.onValueChange = this.onValueChange.bind(this);
  }

  onValueChange(event) {
    const { editable, bounds = {} } = this.props;

    const value = event.target.value;
    this.setState({
      value: value || ''
    });
    const numericVal = unformatSI(value);
    if (isOkNumber(numericVal) && within(bounds)(numericVal)) {
      this.props.onChangeValue(editable, numericVal);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    this.state = {
      value: value ? formatSI(value) : undefined
    };
  }

  render() {
    const { unit } = this.props;
    const { value } = this.state;
    const styles = getStyles(this.context.theme);
    return (
      <div style={styles.value.outer}>
        <input style={styles.value.input}
          name='value'
          min='0'
          value={value}
          onChange={this.onValueChange}
        />
        <span style={{paddingLeft: '5px'}}>
          {unit}
        </span>
      </div>
    );
  }
}

NumericValueEditor.propTypes = {
  editable: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  unit: PropTypes.string,
  bounds: PropTypes.shape({
    lower: PropTypes.number,
    upper: PropTypes.number
  }),

  onChangeValue: PropTypes.func.isRequired
};

NumericValueEditor.contextTypes = {
  theme: PropTypes.object.isRequired
};

export default radium(NumericValueEditor);
