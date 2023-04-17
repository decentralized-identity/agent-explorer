const webpack = require('webpack')

module.exports = {
  babel: {
    plugins: ['@babel/plugin-syntax-import-assertions'],
  },
  webpack: {
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
  },
}
