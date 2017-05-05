const webpack = require('webpack');

module.exports = {
  entry: {
    'browser': './src/env/browser.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015'],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
  ],
  output: {
    filename: `build/browser/api-min.js`,
    libraryTarget: 'umd',
  },
};
