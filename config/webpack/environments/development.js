'use strict';
var webpack = require('webpack');

module.exports = function(_path) {
  return {
    context: _path,
    debug: true,
    devtool: 'source-map',
    devServer: {
      contentBase: './dist',
      info: true,
      hot: true,
      inline: true,
      host:"0.0.0.0",
      port:"8000",
      proxy: {
        '/kyck-rest': {
          target: 'http://localhost:8080/kyck-rest',
        }
      }
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  };
};
