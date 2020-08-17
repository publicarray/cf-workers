const indexHTML = `
<!DOCTYPE html>
<html>
<body>
<h1>Hello World</h1>
<p>This is all generated using a Worker</p>
</body>
</html>
`

async function handleRequest(request) {
    return new Response(indexHTML, {
        headers: {
            'content-type': 'text/html;charset=UTF-8',
        },
    })
}
module.exports = handleRequest
