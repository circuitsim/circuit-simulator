import Reflux from 'reflux';
import React from 'react/addons';

import Vector from 'immutable-vector2d';
import uuid from 'node-uuid';

import {CircuitActions, AddElementActions} from '../actions/CircuitActions.js';

import {GRID_SIZE} from '../components/utils/Constants.js';

export default Reflux.createStore({

  listenables: AddElementActions,

  onStart(elemType, coords) {
    const element = {
        id: uuid.v4(),
        component: elemType,
        props: {
          connectors: {
            from: Vector.fromObject({
              x: coords.x,
              y: coords.y
            }).snap(GRID_SIZE),
            to: Vector.fromObject({
              x: coords.x + 10,
              y: coords.y + 10
            }).snap(GRID_SIZE)
          }
        }
      };

    this.element = element;
    this.trigger(this.element);
  },

  onMove(coords) {
    this.element = React.addons.update(this.element,
      {
        props: {
          connectors: {
            to: {$set: Vector.fromObject({
                    x: coords.x,
                    y: coords.y
                  }).snap(GRID_SIZE)
                }
          }
        }
      });
    this.trigger(this.element);
  },

  onFinish() {
    const element = this.element;
    this.element = null;
    this.trigger(this.element);
    CircuitActions.addElement(element);
  }

});
