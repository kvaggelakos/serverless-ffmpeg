const slsw = require('serverless-webpack')
const WebpackPluginCopy = require('webpack-plugin-copy')
const fs = require('fs')

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new WebpackPluginCopy([
      { from: './binaries/ffmpeg/ffmpeg', copyPermissions: true },
      { from: './binaries/ffmpeg/ffprobe', copyPermissions: true }
    ])
  ]
};