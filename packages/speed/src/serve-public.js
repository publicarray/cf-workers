const html = require('./public/index');
const speedtest = require('./public/speedtest');
const speedtestWorker = require('./public/speedtest_worker');

async function indexHandler(request) {
  const res = new Response(html);
  res.headers.set('content-type', 'text/html; charset=UTF-8');
  res.headers.set('access-control-allow-origin', '*');
  return res;
}

async function speedtestHandler(request) {
  const res = new Response(speedtest);
  res.headers.set('content-type', 'application/javascript; charset=UTF-8');
  return res;
}

async function speedtestWorkerHandler(request) {
  const res = new Response(speedtestWorker);
  res.headers.set('content-type', 'application/javascript; charset=UTF-8');
  return res;
}

module.exports = { indexHandler, speedtestHandler, speedtestWorkerHandler };
