const express = require('express');

const app = express();

app.get('/', (req, res) => {
  const target = req.headers['x-forwarded-host'] || req.hostname;
  const port = req.headers['x-forwarded-port'] || 80;

  const proxy = require('http-proxy').createProxyServer({
    target: `http://${target}:${port}`,
    username: 'username',
    password: 'password',
  });

  proxy.on('request', (proxyReq, proxyRes) => {
    req.pipe(proxyReq);
    proxyRes.pipe(res);
  });

  proxy.on('error', (err, req, res) => {
    console.log(err);
    res.sendStatus(500);
  });

  proxy.listen(3000, () => {
    console.log('Server listening on port 3000');
    console.log(`The server IP address is: ${proxy.address().address}`);
  });
});
