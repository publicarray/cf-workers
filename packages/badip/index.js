// Depending on user agent & return format, return html if browser or plain text or json when cli
// service worker PWA & store custom API key in browser

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
        // Show usage
        return new Response(
            `Usage: curl -s 'https://badip.seby.io/127.0.0.1' | jq`,
            {
                headers: { 'content-type': 'text/plain' },
            },
        )

        // ip =
        //     req.headers.get('cf-connecting-ip') ||
        //     req.headers.get('x-real-ip') ||
        //     '1.1.1.1'
    }
    let params = new URL(req.url).searchParams
    let api = 'ipinfo'
    if (params.has('api')) {
        api = params.get('api')
    }

    // https://mxtoolbox.com/blacklists.aspx
    // https://developers.virustotal.com/reference#ip-address-report

    // https://botscout.com/api.htm
    // https://viewdns.info/
    // https://intelx.io/
    // https://www.zoomeye.org/searchResult?q=5.188.84.104
    // https://bgp.he.net/ip/5.188.84.104
    // https://intelx.io/?s=5.188.84.104
    // https://iknowwhatyoudownload.com/en/peer/?ip=45.121.209.164
    // https://ipgeolocation.io/

    if (api == 'ibm' || api == 'xforce') {
        // https://api.xforce.ibmcloud.com/doc/#auth
        return await newAPI(
            `https://exchange.xforce.ibmcloud.com/api/ipr/${ip}`,
            {
                accept: 'application/json',
                authorization:
                    'Basic ' +
                    btoa(IBM_XFORCE_API_KEY + ':' + IBM_XFORCE_API_PASSWORD),
            },
        )
    } else if (api == 'whois') {
        // https://api.xforce.ibmcloud.com/doc/#resource_WHOIS
        return await newAPI(`https://api.xforce.ibmcloud.com/whois/${ip}`, {
            accept: 'application/json',
            authorization:
                'Basic ' +
                btoa(IBM_XFORCE_API_KEY + ':' + IBM_XFORCE_API_PASSWORD),
        })
    } else if (api == 'badips' || api == 'badip' || api == 'badips.com') {
        // https://www.badips.com/documentation#7
        return await newAPI(`https://www.badips.com/get/info/${ip}`)
    } else if (api == 'stopforumspam') {
        // https://www.stopforumspam.com/usage // included in signals
        return await newAPI(`https://api.stopforumspam.org/api?ip=${ip}&jsonp`)
    } else if ((api == 'iptoasn', api == 'asn')) {
        // https://iptoasn.com/
        return await newAPI(`https://api.iptoasn.com/v1/as/ip/${ip}`)
    } else if (api == 'securitytrails' || api == 'dns') {
        // https://docs.securitytrails.com/docs/overview
        // https://docs.securitytrails.com/reference#general
        return await newAPI(
            `https://api.securitytrails.com/v1/ips/nearby/${ip}`,
            {
                accept: 'application/json',
                apikey: SECURITYTRAILS_API_KEY,
            },
        )
    } else if (api == 'ipinfo') {
        // https://ipinfo.io/developers
        return await newAPI(`https://ipinfo.io/${ip}?token=${IPINFO_TOKEN}`)
    } else if (api == 'shodan') {
        // https://developer.shodan.io/api
        return await newAPI(
            `https://api.shodan.io/shodan/host/${ip}?key=${SHODAN_API_KEY}&minify=true`,
        )
        // } else if (api == 'zerospam') { // https://zerospam.org/spam-blacklist-api/
        //     return await newAPI(`https://zerospam.org/wp-json/v1/query`, {
        //         'accept': 'application/json',
        //         'content-type': 'application/x-www-form-urlencoded'
        //     }, "POST", `ip=${ip}`)
        // }
    } else if (api == 'zerospam') {
        // https://zerospam.org/spam-blacklist-api/
        return await newAPI(
            `https://zerospam.org/wp-json/v1/query`,
            {
                accept: 'application/json',
                'content-type': 'application/json',
            },
            {
                method: 'POST',
                body: JSON.stringify({ ip: ip }),
            },
        )
    } else if (api == 'ipgeolocation' || api == 'ipgeo') {
        // https://ipgeolocation.io/documentation/ip-geolocation-api.html
        return await newAPI(
            `https://api.ipgeolocation.io/ipgeo?apiKey=${IPGEO_API_KEY}&ip=${ip}`,
        )
    }
    //  else if (api == 'talos') {
    //     // https://talosintelligence.com/reputation_center/lookup?search=1.1.1.1
    //     // https://stackoverflow.com/questions/45684786/python-request-for-json-file-returns-none
    //     // https://github.com/TheHive-Project/Cortex/issues/219
    //     // https://github.com/cescobarresi/ciscoreputation/blob/master/ciscoreputation/ciscoreputation.py
    //     return await newAPI(`https://talosintelligence.com/sb_api/query_lookup?query=%2Fapi%2Fv2%2Fdetails%2Fip%2F&query_entry=${ip}&offset=0&order=ip%20asc`, {
    //         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:78.0) Gecko/20100101 Firefox/78.0',
    //         'Accept': 'application/json, text/javascript, */*; q=0.01',
    //         'Accept-Language': 'en-US,en;q=0.5',
    //         'Connection': 'keep-alive',
    //         'TE': 'Trailers'
    //     } ,{
    //         'referer': `https://talosintelligence.com/reputation_center/lookup?search=${ip}`
    //     })
    // }
    else if (api == 'auth0' || api == 'signals' || api == 'signal') {
        // https://auth0.com/signals/docs/#how-to-use-the-api
        return await newAPI(`https://signals.api.auth0.com/v2.0/ip/${ip}`, {
            accept: 'application/json',
            'x-auth-token': AUTH0_SIGNALS_API_KEY,
        })
    }

    return await newAPI(`https://ipinfo.io/${ip}?token=${IPINFO_TOKEN}`)

    // signals.headers.set('Cache-Control', 'max-age=7200, s-maxage=7200')
    // signals.json()['response']
    // if (signalsResponse.status == 404)
    //     return new Response(`Not found in any Blocklist`, {
    //         headers: { 'content-type': 'text/plain' },
    //     })
    // if (signalsResponse.status == 429) {
    //     return new Response(`Quota Exceeded. Too many requests`, {
    //         headers: { 'content-type': 'text/plain' },
    //     })
    // }

    // let responseObj = {
    //     signals: signals,
    //     badips: badips,
    //     xforce: xforce || ''
    // }

    return response
    // return new Response(JSON.stringify(body), {
    //     headers: { 'content-type': 'application/json; charset=UTF-8' },
    // })
}

/**
 * Respond with boolean if the string is a valid IPv4 Address
 * @param {str} string
 */
function isIP(str) {
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        str,
    )
}

/**
 * Construct and send a HTTP Request and respond with body Text or JSON and the Response object
 * @param {url} string
 * @param {headers} object
 */
async function newAPI(
    url,
    headers = { accept: 'application/json' },
    options = {},
) {
    options.headers = headers
    options.cf = {
        // Tell Cloudflare's CDN to always cache this fetch regardless of content type
        // for a max of x seconds before revalidating the resource
        // cacheTtl: 86400, // 1 day
        cacheTtlByStatus: {
            '200-299': 2592000, // 30 days
            404: 300, // 5 min
            '500-599': -1,
        },
        cacheEverything: true,
    }

    let request = new Request(url, options)

    return await fetch(request)

    // let response = await fetch(request)
    // let responseText
    // const contentType = response.headers.get("content-type")
    // if (contentType && contentType.indexOf("application/json") !== -1) {
    //     body = await response.json()
    // } else {
    //     body = await response.text()
    // }

    // return { body, response }
}
