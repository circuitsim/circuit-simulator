import MainLoop from 'mainloop.js';

// simulate as if running @60FPS, but only render 1 in 10 frames
const MAX_FPS = 10;
export const TIMESTEP = 1000 * (1 / 60); // TODO this should probably live somewhere else

export default (begin, update, draw) => {
  let loop;
  const endOfFrame = (fps, panic) => {
    if (panic) {
      loop.resetFrameDelta();
    }
  };

  loop = MainLoop
    .setMaxAllowedFPS(MAX_FPS)
    .setSimulationTimestep(TIMESTEP)
    .setBegin(begin)
    .setUpdate(update)
    .setDraw(draw)
    .setEnd(endOfFrame);

  return loop;
};
