module.exports = function(app) {
  const express = require('express');
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/api/script', (req, res) => {
    res.end(`var ${req.query.var} = ${req.query.num};`);
  });
  app.get('/api/script/timeout', (req, res) => {
    setTimeout(() => { res.end(''); }, 5000);
  });

  app.get('/api/jsonp', (req, res) => {
    res.jsonp(req.query.value);
  });
  app.get('/api/jsonp/timeout', (req, res) => {
    setTimeout(() => { res.jsonp(req.query.value); }, 5000);
  });
};
