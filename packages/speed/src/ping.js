async function handleRequest(request) {
  const res = new Response();
  res.headers.set('content-type', 'text/plain; charset=UTF-8');
  res.headers.set('access-control-allow-origin', '*');
  return res;
}

module.exports = handleRequest;
