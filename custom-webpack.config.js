const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(process.env.APP_VERSION)
    })
  ]
};
