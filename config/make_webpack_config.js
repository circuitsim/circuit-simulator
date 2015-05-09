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
    ? ['babel?whitelist[]=flow','flowcheck','babel?blacklist[]=flow'] // hack from flowcheck/issues#18
    : ['babel'];
  if (options.hot) jsLoader.unshift('react-hot');

  var config = {
    entry: {
      app: entry,
      vendor: ['react']
    },
    resolve: {
      alias: {
        'react/lib': path.resolve(node_modules, 'react/lib')
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
          test: /\.(js|jsx)$/,
          exclude: [node_modules],
          loaders: jsLoader
        },
        {
          // Expose React - react-router requires this
          test: path.resolve(node_modules, deps[0]),
          loader: "expose?React"
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
      noParse: []
    }
  };

  deps.forEach(function (dep) {
    var depPath = path.resolve(node_modules, dep);
    config.resolve.alias[dep.split(path.sep)[0]] = depPath;
    config.module.noParse.push(depPath);
  });

  if (options.minify) {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }));
  }

  return config;
};
