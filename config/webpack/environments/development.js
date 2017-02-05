'use strict';

module.exports = function(_path) {
  return {
    context: _path,
    debug: true,
    devtool: 'source-map',
    output: {
      publicPath: '/'
    },
    devServer: {
      contentBase: './dist',
      info: false,
      inline: false,
      host:"0.0.0.0",
      port: 3000
    }
  };
};