const config = require('./webpack.config');

module.exports = {
  ...config,
  mode: 'production',
  optimization: {
    ...config.optimization,
    minimize: true
  }
};
