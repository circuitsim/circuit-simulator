var path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin'),
    jade = require('jade');

var baseDir = path.resolve(__dirname),
    nodeModulesDir = path.resolve(baseDir, 'node_modules'),

    pathToMain = path.resolve(baseDir, 'dev/main.jsx'),
    indexHtml = jade.compileFile(path.resolve(baseDir, 'dev/index.jade')),

    babel = 'babel?optional=es7.objectRestSpread&optional=runtime',
    // jsLoader = ['react-hot', 'babel?whitelist[]=flow', 'flowcheck', babel + '&blacklist[]=flow']; // hack from flowcheck/issues#18
    jsLoader = ['react-hot', babel]; // until https://github.com/facebook/flow/issues/349 is fixed

var config = {
  entry: {
    app: ['webpack/hot/dev-server', pathToMain],
    vendor: ['react']
  },
  resolve: {
    alias: {}
  },
  devtool: 'eval',
  debug: true,
  output: {
    path: path.resolve(baseDir, 'build'),
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Circuit-Diagram',
      templateContent: function(templateParams) {
        var files = templateParams.htmlWebpackPlugin.files; // js, css, chunks
        return indexHtml(files);
      }
    }),
    new CommonsChunkPlugin('vendor', 'common.js')
  ],
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.(js|jsx)$/,
        exclude: [nodeModulesDir],
        loaders: jsLoader
      },
      { // will be run before loaders above
        test: /\.(js|jsx)$/,
        exclude: [nodeModulesDir],
        loader: 'eslint-loader'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        // Expose React - react-router requires this
        test: require.resolve('react'),
        loader: 'expose?React'
      }
    ],
    eslint: {
      'emitWarning': true,
      'emitError': true,
      'quiet': false
    }
  }
};

module.exports = config;
