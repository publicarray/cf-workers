async function handleRequest(request) {
    let parameters = new URL(request.url).searchParams
    let colours = parameters.get('color') || parameters.get('colour')
    if (colours === null) {
        return new Response('Please pass in colours via query string', {
            status: 404,
        })
    }
    return new Response(colours, {
        headers: {
            'content-type': 'text/plain',
        },
    })
}
module.exports = handleRequest

// async function rawJsonResponse(json) {
//   const init = {
//     headers: {
//       'content-type': 'application/json;charset=UTF-8',
//     },
//   }
//   return new Response(JSON.stringify(json), init)
// }
