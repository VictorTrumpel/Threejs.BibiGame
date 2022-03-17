const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');
const miniCss = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: './src/main.ts',
  devServer: {
    port: 9000,
    static: {
      serveIndex: true,
      directory: __dirname,
    },
  },
  cache: {
    type: 'filesystem',
    allowCollectingMemory: true,
    cacheDirectory: path.resolve(__dirname, '.temp_cache'),
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(s*)css$/,
        use: [miniCss.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(glb|gltf|obj|png|jpg|fbx|dae|css)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/models/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new miniCss({
      filename: 'style.css',
    }),
    new ForkTsCheckerWebpackPlugin(),
  ],
  watchOptions: {
    ignored: /node_modules/,
  },
};
