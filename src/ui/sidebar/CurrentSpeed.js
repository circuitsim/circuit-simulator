import React from 'react';

const { PropTypes } = React;

const styles = {
  container: {
    margin: '5px'
  }
};

export default class CurrentSpeed extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const value = parseInt(event.target.value);
    this.props.onChange(value);
  }

  render() {
    const {
      value
    } = this.props;
    return (
      <span style={styles.container}>
        <label>
          <span>Current speed</span>
          <input className='current-slider' type='range' min='1' max='100' value={value} onChange={this.handleChange} />
        </label>
      </span>
    );
  }
}

CurrentSpeed.propTypes = {
  value: PropTypes.number.isRequired,

  onChange: PropTypes.func.isRequired
};
