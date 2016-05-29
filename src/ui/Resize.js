/* eslint-disable react/prop-types */
import React from 'react';
import getWindowDimensions from './utils/getWindowDimensions.js';
import { getDisplayName } from './diagram/Utils.js';

export default function Resize(WrappedComponent) {
  class Resizer extends React.Component {
    constructor(props) {
      super(props);
      this.state = props.getDimensions();
      this.handleResize = this.handleResize.bind(this);
    }

    handleResize() {
      this.setState(this.props.getDimensions());
    }

    componentDidMount() {
      window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    }

    render() {
      const {getDimensions, ...childProps} = this.props; //eslint-disable-line no-unused-vars
      const props = {
        ...childProps,
        ...this.state
      };
      return (
        <WrappedComponent {...props} />
      );
    }
  }

  Resizer.propTypes = {
    getDimensions: React.PropTypes.func
  };

  Resizer.defaultProps = {
    getDimensions: getWindowDimensions
  };

  Resizer.displayName = `Resize(${getDisplayName(WrappedComponent)})`;

  return Resizer;
}
