const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
// cross-env
// const { merge } = require('webpack-merge');
// const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
// const getBasicConfig = require('./webpack.config.js');

const rootPath = process.cwd();
const pkgJSON = require(path.join(rootPath, 'package.json'));
const testPath = path.join(rootPath, 'test');
const tsCfgPath = path.join(testPath, 'tsconfig.json');

module.exports = {
  mode: 'development',
  target: 'web',
  entry: path.join(testPath, 'index.ts'),
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      '@': path.join(rootPath, 'src'),
      // 不知道为什么，tsconfig-paths-webpack-plugin 无法解析下面两个路径
      '@just4/util': path.resolve(__dirname, '../packages/util/dist/es'),
      '@just4/querystring': path.resolve(__dirname, '../packages/querystring/dist/es')
    }
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
          configFile: tsCfgPath
        }
      }
    ]
  },

  plugins: [
    new ESLintPlugin({
      extensions: ['ts', 'js']
    }),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(testPath, 'index.html'),
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
    port: pkgJSON.devPort,
    disableHostCheck: true,
    compress: false,
    hot: true,
    overlay: {
      warnings: false,
      errors: true
    }
  }
};


// module.exports = function(options) {
//   const testDir = path.resolve(options.dirname, '../test');
//   const tsCfgFile = path.join(testDir, 'tsconfig.json');

//   return merge(getBasicConfig(options), {
//     mode: 'development',
//     entry: path.join(testDir, 'index.ts'),
//     resolve: {
//       alias: {
//         '@': path.resolve(options.dirname, '../src'),
//         // 不知道为什么，tsconfig-paths-webpack-plugin 无法解析下面两个路径
//         '@just4/util': path.resolve(__dirname, '../packages/util/dist/es'),
//         '@just4/querystring': path.resolve(__dirname, '../packages/querystring/dist/es')
//       },
//       // plugins: [
//       //   new TsconfigPathsPlugin({
//       //     configFile: tsCfgFile
//       //   })
//       // ]
//     },
//   });
// };
