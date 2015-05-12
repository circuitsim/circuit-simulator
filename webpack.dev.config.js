module.exports = require('./config/make_webpack_config')({
  devServer: true,
  hot: true,
  outputDir: 'build',
  devtool: 'eval',
  debug: true,
  quiet: false
});
