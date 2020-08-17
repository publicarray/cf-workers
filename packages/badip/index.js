addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})
/**
 * Respond with ip address
 * @param {Request} request
 */
async function handleRequest(req) {
    let ip = new URL(req.url).pathname.substr(1)
    console.log(ip)
    if (!isIP(ip)) {
        return new Response(`Usage: curl -s 'https://badip.seby.io/127.0.0.1' | jq`, {
            headers: { 'content-type': 'text/plain' },
        })

        // ip =
        //     req.headers.get('cf-connecting-ip') ||
        //     req.headers.get('x-real-ip') ||
        //     '1.1.1.1'
    }
    // console.log(ip)
    // full_reputaion = await new Request(`https://signals.api.auth0.com/v2.0/ip/${ip}`, {
    //     headers: { 'accept': 'application/json' },
    //     headers: { 'x-auth-token': AUTH0_SIGNALS_API_KEY },
    // })

    // https://auth0.com/signals/docs/#how-to-use-the-api
    //  https://signals.api.auth0.com/v2.0/ip/${ip}
    // https://www.stopforumspam.com/usage  // included from signals
    //  http://api.stopforumspam.org/api?ip=${ip}

    // https://zerospam.org/spam-blacklist-api/
    //  https://zerospam.org/wp-json/v1/query?ip=${ip}

    // https://mxtoolbox.com/blacklists.aspx
    let getSignals = new Request(`https://signals.api.auth0.com/badip/${ip}`, {
        headers: {
            'accept': 'application/json',
            'x-auth-token': AUTH0_SIGNALS_API_KEY,
        },
        cf: {
            // Tell Cloudflare's CDN to always cache this fetch regardless of content type
            // for a max of x seconds before revalidating the resource
            // cacheTtl: 86400, // 1 day
            cacheTtlByStatus: {
                "200-299": 2592000, // 30 days
                404: 300, // 5 min
                "500-599": -1
            },
            cacheEverything: true,
        },
    })
    let signals = await fetch(getSignals)
    // signals.headers.set('Cache-Control', 'max-age=7200, s-maxage=7200')
    // signals.json()['response']
    if (signals.status == 404)
        return new Response(`Not found in any Blocklist`, {
            headers: { 'content-type': 'text/plain' },
        })
    if (signals.status == 429) {
        return new Response(`Quota Exceeded. Too many requests`, {
            headers: { 'content-type': 'text/plain' },
        })
    }
    return signals
}

function isIP(str) {
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        str,
    )
}
