const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    node: './src/env/node.js',
  },
  externals: [nodeExternals()],
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
  plugins: [new webpack.optimize.UglifyJsPlugin()],
  output: {
    filename: `build/node/api-min.js`,
    libraryTarget: 'commonjs2',
  },
  target: 'node',
};
