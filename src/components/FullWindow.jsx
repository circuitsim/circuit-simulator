import React from 'react/addons';

var getDimensions = () => ({width: window.innerWidth, height: window.innerHeight});

export default class FullWindow extends React.Component {
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
    const child = React.addons.cloneWithProps(React.Children.only(this.props.children),
      {
        width: this.state.width,
        height: this.state.height
      }
    );
    return child;
  }

}
