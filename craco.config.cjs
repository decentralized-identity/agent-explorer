const CracoLessPlugin = require('craco-less')
const webpack = require('webpack')

module.exports = {
  webpack: {
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  babel: {
    plugins: ['@babel/plugin-syntax-import-assertions'],
  },
}
