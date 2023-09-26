const webpack = require('webpack')

module.exports = {
  babel: {
    presets: [[
      "@babel/preset-react",
      {
        "runtime": "automatic" // defaults to classic
      }
    ]],
    plugins: ['@babel/plugin-syntax-import-assertions'],
  },
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        http: require.resolve('stream-http'),
        url: require.resolve('url/'),
        zlib: require.resolve('browserify-zlib'),
        https: require.resolve('https-browserify'),
      }
      /* ... */
      return webpackConfig
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
  },
}
