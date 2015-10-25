import R from 'ramda';

export default function camelToSpace(string) {
  return R.replace(/([a-z\d])([A-Z])/g, '$1 $2', string);
}
