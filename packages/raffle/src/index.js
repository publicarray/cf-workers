const Router = require('./router')
const ranHandler = require('./ran')
const localHandler = require('./local-html')
async function handleRequest(request) {
    const r = new Router()
    r.get('.*/ran', ranHandler)
    r.get('/', localHandler)
    return await r.route(request)
}
module.exports = handleRequest
