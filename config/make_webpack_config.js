var path = require('path'),
    baseDir = path.resolve(__dirname, '..'),

    HtmlWebpackPlugin = require('html-webpack-plugin'),
    CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin"),

    node_modules = path.resolve(baseDir, 'node_modules'),

    pathToMain = path.resolve(baseDir, 'app/main.jsx'),

    jade = require('jade'),
    indexHtml = jade.compileFile(path.resolve(baseDir, 'app/index.jade'))

    deps = [
      'react/dist/react.min.js'
    ];

module.exports = function(options) {
  var entry = options.devServer
    ? ['webpack/hot/dev-server', pathToMain]
    : pathToMain;

  var jsLoader = options.flowcheck
    ? ['babel?whitelist[]=flow','flowcheck','babel?optional[]=es7.objectRestSpread&blacklist[]=flow'] // hack from flowcheck/issues#18
    : ['babel?optional[]=es7.objectRestSpread'];
  if (options.hot) jsLoader.unshift('react-hot');

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
      filename: 'bundle.js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'CircuitSim',
        templateContent: function(templateParams, webpackCompiler) {
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
          loaders: ['style','css']
        },
        {
          test: /\.scss$/,
          loaders: ['style','css', 'sass?includePaths[]=' + require('node-bourbon').includePaths]
        },
        {
          test: /\.(js|jsx)$/,
          exclude: [node_modules],
          loaders: jsLoader
        },
        {
          // Expose React - react-router requires this
          test: require.resolve("react"),
          loader: "expose?React"
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
      noParse: []
    }
  };

  if (options.noParseDeps) {
    console.log('ignoring deps');
    deps.forEach(function (dep) {
      var depPath = path.resolve(node_modules, dep);
      config.resolve.alias[dep.split(path.sep)[0]] = depPath;
      config.module.noParse.push(depPath);
    });
    config.resolve.alias['react/lib'] = path.resolve(node_modules, 'react/lib');
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
