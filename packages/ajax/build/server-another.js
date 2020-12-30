const express = require('express');

const app = express();

app.get('/api/xhr/get', (req, res) => {
  res.set('Access-Control-Allow-Origin', req.get('Origin'));
  res.json({ id: req.query.id });
});

app.get('/api/xhr/get/error', (req, res) => {
  res.set('Access-Control-Allow-Origin', req.get('Origin'));
  res.status(500).json({ msg: 'error' });
});

app.get('/api/xhr/set-cookie', (req, res) => {
  res.set('Access-Control-Allow-Origin', req.get('Origin'));
  res.set('Access-Control-Allow-Credentials', 'true');
  res.cookie('test', '1', { sameSite: 'None' });
  res.end();
});

app.get('/api/xhr/get-cookie', (req, res) => {
  res.set('Access-Control-Allow-Origin', req.get('Origin'));
  res.set('Access-Control-Allow-Credentials', 'true');
  res.end(/(^|;\s*)test=([^;]+)/.test(req.get('Cookie')) ? RegExp.$2 : '');
});

app.listen(8606);
