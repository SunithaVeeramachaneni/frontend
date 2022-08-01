const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      TENANTS_COUNT: JSON.stringify(process.env.TENANTS_COUNT)
    })
  ]
};
