const path = require('path');

module.exports = {
  entry: {
      'bundle': './src/index.js',
      'webworker': './src/webworker.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build')
  }
};
