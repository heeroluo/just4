const path = require('path');
const merge = require('webpack-merge').merge;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const getBasicConfig = require('./webpack.config.js');


module.exports = function(options) {
  const testDir = path.resolve(options.dirname, '../test/');

  return merge(getBasicConfig(options), {
    mode: 'development',
    entry: path.join(testDir, 'index.ts'),
    resolve: {
      alias: {
        '@': path.resolve(options.dirname, '../src')
      }
    },

    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            configFile: path.join(testDir, 'tsconfig.json')
          }
        }
      ]
    },

    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.join(testDir, 'index.html'),
        inject: 'body'
      }),

      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, '../qunit'),
            to: 'qunit'
          }
        ]
      })
    ],

    devServer: {
      host: '0.0.0.0',
      port: options.port,
      disableHostCheck: true,
      compress: false,
      overlay: true
    }
  });
};
