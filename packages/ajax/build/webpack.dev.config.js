const merge = require('webpack-merge').merge;

module.exports = merge(
  require('../../../build/webpack.dev.config')({
    dirname: __dirname,
    port: 8605
  }), {
    devServer: {
      before: function(app) {
        require('./server-another');
        require('./server-main')(app);
      }
    }
  }
);
