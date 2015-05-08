var path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),

    node_modules = path.resolve(__dirname, 'node_modules');
    pathToReact = path.resolve(node_modules, 'react/dist/react.min.js');

    jade = require('jade'),
    indexHtml = jade.compileFile(path.resolve(__dirname, 'dev/index.jade'));

module.exports = {
  entry: ['webpack/hot/dev-server', path.resolve(__dirname, 'app/main.jsx')],
  resolve: {
    alias: {
      'react': pathToReact
    }
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'CircuitSim',
      templateContent: function(templateParams, webpackCompiler) {
        var files = templateParams.htmlWebpackPlugin.files; // js, css, chunks
        return indexHtml(files);
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ],
    noParse: [pathToReact]
  }
};