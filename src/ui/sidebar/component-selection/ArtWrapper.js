import React from 'react';
import {Surface, Group, Transform} from 'react-art';
import Vector from 'immutable-vector2d';

const W = 50,
      H = W,
      S = 0.6;

const scale = new Transform()
  .translate(W / 2, H / 2)
  .scale(S, S)
  .translate(-W / 2, -H / 2); // scale from center

const ArtWrapper = ({ art: Art, colors }) => {
  const dragPoints = [new Vector(0, 0), new Vector(W, H)];
  const connectorPoints = Art.getConnectorPositions(dragPoints);
  return (
    <div style={{padding: 0, margin: 0, border: 0}}>
      <Surface
        width={W}
        height={H}
        style={{display: 'block'}}
      >
        <Group transform={scale} >
          <Art
            connectors={connectorPoints}
            dragPoints={dragPoints}
            current={0}
            colors={colors}
          />
        </Group>
      </Surface>
    </div>
  );
};

ArtWrapper.propTypes = {
  art: React.PropTypes.any.isRequired,
  colors: React.PropTypes.arrayOf(React.PropTypes.string)
};

export default ArtWrapper;
