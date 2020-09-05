addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})
/**
 * Respond with ip address
 * @param {Request} request
 */
async function handleRequest(req) {
    return new Response(req.headers.get('CF-Connecting-IP'), {
        headers: { 
            'content-type': 'text/plain',
            'access-control-allow-origin': '*'
        },
    })
}

// console.log(new Map(req.headers))
