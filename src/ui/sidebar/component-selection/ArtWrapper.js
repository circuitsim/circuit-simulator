import React from 'react';
// import {Surface, Group, Transform} from 'react-art';
import {initCanvas, createComponentRenderer} from '../../diagram/render';
import Vector from 'immutable-vector2d';

const W = 50,
      H = W,
      S = 0.6;

class ArtWrapper extends React.Component {
  componentDidMount() {
    const ctx = this.canvas.getContext('2d');
    initCanvas(ctx, this.context.theme);

    ctx.translate(W / 2, H / 2);
    ctx.scale(S, S);
    ctx.translate(-W / 2, -H / 2); // scale from center

    const {art: Art} = this.props;
    const dragPoints = [new Vector(0, 0), new Vector(W, H)];
    const connectors = Art.transform.getConnectors(dragPoints);
    const render = createComponentRenderer(ctx);
    render(Art, {dragPoints, connectors});
  }

  render() {
    return (
      <canvas
        ref={c => this.canvas = c}

        width={W}
        height={H}
        style={{
          padding: 0,
          margin: 0,
          border: 0,
          display: 'block'
        }}
      />
    );
  }
}

ArtWrapper.propTypes = {
  art: React.PropTypes.any.isRequired,
  colors: React.PropTypes.arrayOf(React.PropTypes.string)
};

ArtWrapper.contextTypes = {
  theme: React.PropTypes.object.isRequired
};

export default ArtWrapper;
