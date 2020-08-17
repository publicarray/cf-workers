import sendEmail from './src/email'

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

/**
 * Respond
 * @param {Request} req
 */
async function handleRequest(req) {
    if (req.method.toLowerCase() === 'post') {
        return sendEmail(req)
    }

    return new Response('Hello worker!', {
        headers: { 'content-type': 'text/plain' },
    })
}
