const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

function _resolvePath (...args) {
  const parts = [__dirname].concat(args)
  return path.resolve.apply(null, parts)
}

module.exports = {
  entry: [
    _resolvePath('demo', 'index.js')
  ],
  output: {
    path: _resolvePath('dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '~': _resolvePath('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        options: { emitWarning: true },
        include: [_resolvePath('src')]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' }
        ],
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['main'],
      template: _resolvePath('demo', 'index.html'),
      inject: true
    }),
  ],
  // dev server configs
  devServer: {
    contentBase: _resolvePath('demo'),
    port: 3000,
    overlay: true,
    inline: true,
    hot: true
  },
  // fix node server modules
  // node: {
  //   fs: 'empty'
  // }
}
