const MAX_NUMBER = 100
/**
 * Respond with random number
 * @param {Request} request
 */
async function handleRequest(request) {
    let parameters = new URL(request.url).searchParams
    let maxNumber = parameters.get('max') || MAX_NUMBER
    return new Response(randomNumber(maxNumber), {
        headers: {
            'content-type': 'text/plain',
        },
    })
}

function randomNumber(max) {
    // Divide a random UInt32 by the maximum value (2^32 -1) to get a result between 0 and 1
    return Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295 * max) + 1
}
module.exports = handleRequest
