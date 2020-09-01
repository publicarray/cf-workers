import sendEmail from './src/email'
// https://validatejs.org/
import isEmail from 'validator/es/lib/isEmail'
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

/**
 * Respond
 * @param {Request} req
 */
async function handleRequest(req) {
    if (req.method.toLowerCase() == 'post') {
        // if (req.mode == 'same-origin')
        // if (req.referrer  == 'client')
        let json = {}
        if (req.headers.has('content-type') && req.headers.get('content-type') == 'application/x-www-form-urlencoded') {
            let formData = await req.formData()
            json = JSON.parse(JSON.stringify(Object.fromEntries(formData.entries())))
        } else if (req.headers.has('content-type') && req.headers.get('content-type') == 'application/json') {
            json = await req.json()
        }

        if (validate(json)) {
            let d = {}
            d.message = json.message || ''
            d.return_to = json.return_to || 'hello@example.com'
            d.name = json.name || ''
            return sendEmail(d.message.trim(), d.return_to.trim(), d.name.trim())
        }
        return new Response(null, { status: 400 })
    }

    return new Response(null, { status: 405 })
}

/**
 * [validate description]
 * @param  {[type]} json [description]
 * @return bool      json is Valid
 */
function validate(json) {
    let isValid = false
    console.log(json)
    if ('website' in json == false) {
        // check honeypot
        console.debug('website key is missing')
        return false
    } else if ('website' in json && json.website.trim() != '') {
        // check honeypot
        console.debug('website key has content')
        return false
    }
    if (
        (json.return_to && isEmail(json.return_to)) ||
        (json.returnTo && isEmail(json.returnTo)) ||
        (json.email && isEmail(json.email))
    ) {
        console.debug('validate email')
        isValid = true
    }

    let element_count = 1
    for (let key in json) {
        console.log(key, json[key])
        if (element_count >= 2) {
            // quick exit
            console.debug('validate that JSON contains at least 2 keys')
            isValid = true
            break
        }
        element_count++
    }

    console.debug('isValid', isValid)
    return isValid
}
