const Router = require('./router')
const ranHandler = require('./ran')
const echoHandler = require('./echo')
const indexHandler = require('./index-html')
const localHandler = require('./local-html')
async function handleRequest(request) {
    const r = new Router()
    r.get('.*/ran', ranHandler)
    // r.get('.*/echo', echoHandler)
    // r.get('/', () => new Response('Hello Human!'))
    r.get('/', localHandler)
    return await r.route(request)
}
module.exports = handleRequest
