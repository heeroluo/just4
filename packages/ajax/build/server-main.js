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

  app.get('/api/xhr/get', (req, res) => {
    res.json({ id: req.query.id });
  });
  app.get('/api/xhr/get/timeout', (req, res) => {
    setTimeout(() => {
      res.end();
    }, 5000);
  });
  app.get('/api/xhr/get/error', (req, res) => {
    res.status(500).json({ msg: 'error' });
  });
  app.post('/api/xhr/post', (req, res) => {
    res.json({ id: req.body.id });
  });
};
