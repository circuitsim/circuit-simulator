import Color from 'color';

const colors: { [key: string]: string } = {
  background: '#333',
  base: '#ccc',
  theme: '#8800ff',
  transparent: 'rgba(0,0,0,0)',
  translucent: 'rgba(0,255,255,0.5)',

  trans: function(color: string) {
    const c = new Color(color);
    return c.clearer(0.5).rgbString();
  }
};

export default colors;
