import React from 'react';
import CircuitDiagram from './CircuitDiagram.jsx';

var getDimensions = () => ({width: window.innerWidth, height: window.innerHeight});

export default class FullWindowDiagram extends React.Component {
  constructor(props) {
    super(props);
    this.state = getDimensions();

    this.handleResize = this.handleResize.bind(this);
  }

  handleResize() {
    this.setState(getDimensions());
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    return (
      <CircuitDiagram width={this.state.width} height={this.state.height} {...this.props} />
    );
  }

}
