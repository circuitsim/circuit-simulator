import Color from 'color';

const trans = function(color: string, by = 0.5) {
  const c = new Color(color);
  by %= 1;
  return c.clearer(by).rgbString();
};

const BASE_COLOR = '#aaa';
const ELECTRIC_BLUE = '#7DF9FF';

const COLORS = {
  background: '#222',
  canvasBackground: '#333',

  base: BASE_COLOR,
  transBase: trans(BASE_COLOR),

  highlight: 'white',

  theme: ELECTRIC_BLUE,

  current: trans(ELECTRIC_BLUE, 0.3)
};

const TYPOGRAPHY = {
  'fontFamily': '\'Helvetica Neue\', Helvetica, Arial, sans-serif',
  'lineHeight': '1.5em',
  'fontSize': '12px'
};

export default {
  COLORS,
  TYPOGRAPHY
};
