/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env node */

require('dotenv').config();
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  devServer: {
    historyApiFallback: true,
    static: './dist',
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico',
      manifest: './public/manifest.json',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/manifest.json', to: 'manifest.json' },
        { from: 'public/_redirects', to: '_redirects', toType: 'file' },
      ],
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_BASE_PATH': JSON.stringify(
        process.env.REACT_APP_BASE_PATH
      ),
      'process.env.REACT_APP_GOOGLE_CLIENT_ID': JSON.stringify(
        process.env.REACT_APP_GOOGLE_CLIENT_ID
      ),
      'process.env.PUBLIC_URL': JSON.stringify(''),
    }),
  ],
};
