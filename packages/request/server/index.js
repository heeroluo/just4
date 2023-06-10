module.exports = function(app) {
  const express = require('express');
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/api/text', (req, res) => {
    res.end(req.query.num);
  });
  app.post('/api/text', (req, res) => {
    res.end(req.body.num);
  });
  app.get('/api/json', (req, res) => {
    res.json({ num: req.query.num });
  });
  app.post('/api/json', (req, res) => {
    res.json({ num: req.body.num });
  });
  app.get('/api/timeout', (req, res) => {
    setTimeout(() => { res.end(''); }, 5000);
  });
  app.get('/api/error', (req, res) => {
    res.status(500);
    res.json({ num: req.query.num });
  });
};
