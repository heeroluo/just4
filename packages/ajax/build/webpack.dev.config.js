const merge = require('webpack-merge').merge;

module.exports = merge(
  require('../../../build/webpack.dev.config')({
    dirname: __dirname,
    port: 8606
  }), {
    devServer: {
      before: function(app) {
        require('./server-main')(app);
      }
    }
  }
);
