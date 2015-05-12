var webpack = require('webpack'),
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin'),
    jade = require('jade');

var baseDir = path.resolve(__dirname, '..'),
    nodeModulesDir = path.resolve(baseDir, 'node_modules'),
    pathToMain = path.resolve(baseDir, 'app/main.jsx'),

    indexHtml = jade.compileFile(path.resolve(baseDir, 'app/index.jade')),

    deps = [
      'react/dist/react.min.js'
    ];

module.exports = function(options) {
  var entry = options.devServer
    ? ['webpack/hot/dev-server', pathToMain]
    : pathToMain;

  var babel = 'babel?optional=es7.objectRestSpread&optional=runtime';
  var jsLoader = options.flowcheck
    ? ['babel?whitelist[]=flow', 'flowcheck', babel + '&blacklist[]=flow'] // hack from flowcheck/issues#18
    : [babel];
  if (options.hot) { jsLoader.unshift('react-hot'); }

  var config = {
    entry: {
      app: entry,
      vendor: ['react']
    },
    resolve: {
      alias: {}
    },
    devtool: options.devtool,
    debug: options.debug,
    output: {
      path: path.resolve(baseDir, options.outputDir),
      filename: 'bundle.js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'CircuitSim',
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
          loaders: ['style', 'css', 'sass?includePaths[]=' + require('node-bourbon').includePaths]
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
          // Expose React - react-router requires this
          test: require.resolve('react'),
          loader: 'expose?React'
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
      noParse: [],
      eslint: {
        'emitWarning': !options.quiet,
        'emitError': !options.quiet,
        'quiet': options.quiet
      }
    }
  };

  if (options.noParseDeps) {
    deps.forEach(function (dep) {
      var depPath = path.resolve(nodeModulesDir, dep);
      config.resolve.alias[dep.split(path.sep)[0]] = depPath;
      config.module.noParse.push(depPath);
    });
    config.resolve.alias['react/lib'] = path.resolve(nodeModulesDir, 'react/lib');
  }

  if (options.minify) {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }));
  }

  return config;
};
