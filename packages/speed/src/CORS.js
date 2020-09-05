async function handleRequest(request) {
  const res = new Response();
  res.headers.set('access-control-allow-origin', '*');
  res.headers.set('access-control-allow-methods', 'GET, POST');
  res.headers.set(
    'access-control-request-headers',
    'Content-Encoding, Content-Type'
  );
  return res;
}

module.exports = handleRequest;
