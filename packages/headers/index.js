addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})
/**
 * Respond with request headers
 * @param {Request} request
 */
async function handleRequest(req) {
    let string = ''
    for (let header of req.headers) {
        string += header[0] + ': ' + header[1] + '\n'
    }

    return new Response(string, {
        headers: { 'content-type': 'text/plain' },
    })
}
