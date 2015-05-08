module.exports = require('./config/make_webpack_config')({
  devServer: true,
  outputDir: 'build',
  devtool: 'eval',
  debug: true
});
