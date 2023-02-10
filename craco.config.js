const CracoLessPlugin = require('craco-less')
const webpack = require('webpack')

module.exports = {
  babel: {
    plugins: ["@babel/plugin-syntax-import-assertions"]
  },
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
}
