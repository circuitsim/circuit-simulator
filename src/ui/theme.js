import Color from 'color';

const trans = function(color: string, by = 0.5) {
  const c = new Color(color);
  by %= 1;
  return c.clearer(by).rgbString();
};

const BASE_COLOR = '#aaa';
const ELECTRIC_BLUE = '#7DF9FF';

const COLORS = {
  background: '#282828',
  canvasBackground: '#333',
  insetBackground: '#222',

  buttonBackground1: '#444',
  buttonBackground2: '#3D3D3D',
  textInputBackground: '#3D3D3D',

  danger: '#B33A3A',

  canvasOverlayBackground: '#555',

  base: BASE_COLOR,
  transBase: trans(BASE_COLOR),
  baseShadow: '#3D3D3D',

  boxShadow: '#555',

  semiHighlight: '#ddd',
  highlight: 'white',

  theme: ELECTRIC_BLUE,

  current: trans(ELECTRIC_BLUE, 0.3),
  positiveVoltage: '#45FF00',
  negativeVoltage: '#2563FF',

  transparent: 'rgba(0,0,0,0)',
  transBlack: 'rgba(0,0,0,0.75)'
};

const TYPOGRAPHY = {
  'fontFamily': 'Open Sans, Helvetica, Arial, sans-serif',
  'fontSize': '12px'
};

const STYLES = {
  title: {
    lineHeight: '1.5em',
    fontWeight: 'bold',
    fontSize: 'smaller',
    textTransform: 'uppercase',
    color: COLORS.semiHighlight
  }
};

export default {
  COLORS,
  TYPOGRAPHY,
  STYLES,
  trans
};
