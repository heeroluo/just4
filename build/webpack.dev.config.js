const path = require('path');
const merge = require('webpack-merge').merge;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const getBasicConfig = require('./webpack.config.js');

module.exports = function(options) {
  const testDir = path.resolve(options.dirname, '../test/');
  const tsCfgFile = path.join(testDir, 'tsconfig.json');

  return merge(getBasicConfig(options), {
    mode: 'development',
    entry: path.join(testDir, 'index.ts'),
    resolve: {
      alias: {
        // 不知道为什么，tsconfig-paths-webpack-plugin 无法解析下面两个路径
        '@just4/util': path.resolve(__dirname, '../packages/util/dist'),
        '@just4/querystring': path.resolve(__dirname, '../packages/querystring/dist')
      },
      plugins: [
        new TsconfigPathsPlugin({
          configFile: tsCfgFile
        })
      ]
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                useBuiltIns: 'usage',
                corejs: 3
              }]
            ],

            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-json-strings',
              '@babel/plugin-syntax-dynamic-import',
              '@babel/plugin-syntax-import-meta'
            ]
          }
        },

        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            configFile: tsCfgFile
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
