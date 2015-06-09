import Color from 'color';

export const trans = function(color: string, by = 0.5) {
    const c = new Color(color);
    by %= 1;
    return c.clearer(by).rgbString();
  };

const colors: { [key: string]: string } = {
  background: '#333',
  base: '#ccc',
  highlight: 'white',
  theme: '#8800ff',
  transparent: 'rgba(0,0,0,0)',

  current: trans('#7DF9FF', 0.3) // electric blue
};
colors.transBase = trans(colors.base);

export default colors;
