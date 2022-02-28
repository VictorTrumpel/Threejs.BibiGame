const path = require('path');

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
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(glb|gltf|obj|png|jpg|fbx)$/,
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
  watchOptions: {
    ignored: /node_modules/,
  },
};
