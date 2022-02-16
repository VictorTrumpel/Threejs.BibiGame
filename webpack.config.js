const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressPlugin = require('progress-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './index.ts',
  devServer: {
    watchFiles: path.resolve(__dirname, 'build'),
    port: 9000,
    historyApiFallback: {
      index: 'index.html',
    },
    proxy: {
      'http://localhost:9000/:id': {
        bypass: (req, res) =>
          res.send({
            mssg: 'proxy server - TEST proxy',
          }),
      },
    },
  },
  watch: true,
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/cache-loader'),
            },
          },
          'ts-loader',
          {
            options: { eslintPath: require.resolve('eslint') },
            loader: require.resolve('eslint-loader'),
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
    ],
  },
  optimization: {
    flagIncludedChunks: true,
    innerGraph: false,
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'title',
      template: 'index.html',
    }),
    new ProgressPlugin(true),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
};
