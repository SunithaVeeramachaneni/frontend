const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      ENCRYPTION_KEY: JSON.stringify(process.env.ENCRYPTION_KEY),
      TENANTS_COUNT: JSON.stringify(process.env.TENANTS_COUNT)
    })
  ]
};
