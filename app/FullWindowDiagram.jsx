/* @flow */

'use strict';

import CircuitDiagram from './CircuitDiagram.jsx';

export default class FullWindowDiagram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {width: window.innerWidth, height: window.innerHeight};

    this.handleResize = this.handleResize.bind(this);
  }

  handleResize(event) {
    this.setState({width: window.innerWidth, height: window.innerHeight});
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    return (
      <CircuitDiagram width={this.state.width} height={this.state.height} />
    );
  }

}
