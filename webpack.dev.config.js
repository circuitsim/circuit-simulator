var path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin'),
    jade = require('jade');

var baseDir = path.resolve(__dirname),
    nodeModulesDir = path.resolve(baseDir, 'node_modules'),

    pathToEntry = path.resolve(baseDir, 'demo/demo.jsx'),
    indexHtml = jade.compileFile(path.resolve(baseDir, 'demo/index.jade'));

    // jsLoader = ['react-hot', 'babel?whitelist[]=flow', 'flowcheck', babel + '&blacklist[]=flow']; // hack from flowcheck/issues#18

var config = {
  entry: {
    /* NOTE: React hot loader doesn't work with higher-order components :( */
    app: ['webpack/hot/dev-server', pathToEntry],
    vendor: ['react', 'react-art', 'art', 'reflux']
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
        loaders: ['react-hot', 'babel'] // until https://github.com/facebook/flow/issues/349 is fixed
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
