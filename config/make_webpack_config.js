var path = require('path'),
    baseDir = path.resolve(__dirname, '..'),

    HtmlWebpackPlugin = require('html-webpack-plugin'),

    node_modules = path.resolve(baseDir, 'node_modules'),
    pathToReact = path.resolve(node_modules, 'react/dist/react.min.js'),

    pathToMain = path.resolve(baseDir, 'app/main.jsx'),

    jade = require('jade'),
    indexHtml = jade.compileFile(path.resolve(baseDir, 'app/index.jade'));

module.exports = function(options) {
  var entry = options.devServer
    ? ['webpack/hot/dev-server', pathToMain]
    : pathToMain;

  var config = {
    entry: entry,
    resolve: {
      alias: {
        'react': pathToReact
      }
    },
    devtool: options.devtool,
    debug: options.debug,
    output: {
      path: path.resolve(baseDir, options.outputDir),
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
          loaders: ['style','css']
        },
        {
          test: /\.jsx?$/,
          exclude: [node_modules],
          loaders: options.flowcheck
            ? ['babel?whitelist[]=flow','flowcheck','babel?blacklist[]=flow'] // hack from flowcheck/issues#18
            : ['babel']
        },
        {
          test: /\.scss$/,
          loader: ['style','css', 'sass']
        },
        {
          test: /\.(png|jpg)$/,
          loader: 'url?limit=25000'
        },
        {
          test: /\.woff$/, // should maybe be .svg instead?
          loader: 'url?limit=100000'
        }
      ],
      noParse: [pathToReact]
    }
  };

  return config;
};