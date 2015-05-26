import Color from 'color';

export const trans = function(color: string) {
    const c = new Color(color);
    return c.clearer(0.5).rgbString();
  };

const colors: { [key: string]: string } = {
  background: '#333',
  base: '#ccc',
  theme: '#8800ff',
  transparent: 'rgba(0,0,0,0)'
};
colors.transBase = trans(colors.base);

export default colors;
