import path from 'path';

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    main: './src/index.js',
  },
  output: {
    filename: '[name].webpack.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
