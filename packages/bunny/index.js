import signUrl from './token.js'

/**
 * BunnyCDN Storage API ZoneName
 * @type {String}
 */
const STORAGE_ZONE_NAME = 'seby-io'

/**
 * The BunnyCDN Storage API endpoint
 * @type {String}
 */
const STORAGE_SERVER = 'https://la.storage.bunnycdn.com'

/**
 * The base url of the worker, failed redirects go here
 * @type {String}
 */
const BASE_URL = 'https://seby.io'

/**
 * BunnyCDN PullZone Hostname to redirect requests to files
 * @type {String}
 */
const PULL_ZONE = 'files.seby.io'

/**
 * Timezone for formatting the date string
 * @type {String}
 */
const TIMEZONE = 'Australia/Sydney'

/**
 * Allow-list of top directories to display folder index
 * This is useful when you want to share selected files for a limited group of people. e.g With a direct link.
 * Set the Variable to an empty array: [] this to disable the allow-list:
 * // const INDEX_ALLOW_LIST = []
 * @type {Array}
 */
const INDEX_ALLOW_LIST = ['download']

/**
 * Cache BunnyAPI Responses, TTL is set by status code
 * @type {Object}
 */
const CF_REQUEST_CACHE = {
    cacheTtlByStatus: {
        '200-299': 86400, // 1 day
        404: 300, // 5 min
        '500-599': -1,
    },
    cacheEverything: true,
}

/**
 * Convenience function to format a timestamp string to locale string
 * @param  {String} timeStamp a ISO date string
 * @param  {String} country Country Code of the IPAddress
 * @return {String}            Localised date string
 */
function formatTimeStamp(timeStamp, country) {
    return new Date(timeStamp).toLocaleString(country, { timeZone: TIMEZONE })
}

/**
 * Return an absolute path that is one level up (../)
 * @param  {String} path contains the pathname from a URL
 * @return {String}      absolute URL
 */
function oneLevelUp(path) {
    // slice the first `/`, It prevents the first element in the
    // split array from being empty (the '/' gets added back later)
    let pathname = path.slice(1).split('/')
    if (pathname.length >= 1) {
        pathname.pop()
        pathname = pathname.join('/')
        return new URL(`${BASE_URL}/${pathname}`).toString()
    }
    return BASE_URL
}

/**
 * Return a HTML response that contains the folder listing using
 * a JSON object from BunnyCDN Storage API
 *
 * @param  {Object} json A BunnyCDN Storage API JSON response
 * @param  {String} country Country Code of the IPAddress
 * @return {Response}      HTML response of a folder index of a list of containing files
 */
function renderFolderListing(json, country) {
    let path = json[0].Path.replace(`/${STORAGE_ZONE_NAME}`, '')
    let html = `
<!DOCTYPE html>
<head>
<meta http-equiv="Content-type" content="text/html; charset=UTF-8" />
<title>Index of ${path}</title></head>
<body>
<h1>Index of ${path}</h1><pre>${`Name`.padEnd(100)} ${`Last modified (AEST)`.padEnd(30)} ${`Created (AEST)`.padEnd(30)}
<hr>
<a href="${oneLevelUp(path)}">${`Parent Directory</a>`.padEnd(104)} ${`-`.padEnd(30)}
${json
    .map(
        (item, i) => `
<a href="${path}${item.ObjectName}">${`${item.ObjectName}</a>`.padEnd(104)} ${formatTimeStamp(item.LastChanged, country).padEnd(30)} ${formatTimeStamp(
            item.DateCreated,
            country,
        ).padEnd(30)}
`,
    )
    .join('')}
</pre><hr><address>Proudly Served with Cloudflare Workers and BunnyCDN</address>
</body>
`
    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}

/**
 * Use the BunnyCDN Storage API to fetch a file and craft a Response. With the response cached by CloudFlare
 * @param  {String} url the file path
 * @return {Response}     API Response containing the requested file
 */
async function getFileFromBunny(url) {
    let requestFile = new Request(url, {
        headers: {
            AccessKey: `${BUNNY_STORAGE_ACCESS_KEY}`,
        },
        cf: CF_REQUEST_CACHE,
    })
    let response = await fetch(requestFile)
    if (response.ok) {
        return response
    }
    // On error, return to BASE_URL
    return Response.redirect(`${BASE_URL}`, 302)
}

/**
 *  Redirect to the file stored on BunnyCDN with an authentication token that expires in 1 hour
 * @param  {String} url
 * @param  {String} pathname
 * @param  {String} ip the allowed ip address
 * @return {Response} Redirect to File
 */
async function redirectToBunnyPullZone(url, pathname, ip) {
    var signedUrl = await signUrl(url, `${BUNNY_TOKEN_KEY}`, 1 * 60 * 60, ip, false, null, null, null)
    console.log('signed-url', signedUrl)
    return Response.redirect(signedUrl, 302)
}

/**
 * Respond with redirect, folder index or file from BunnyCDN
 * @param {Request} request
 */
async function handleRequest(request) {
    const country = request.headers.get('cf-ipcountry')
    let { pathname } = new URL(request.url)
    let path = pathname.slice(1).split('/')
    pathname = path.join('/') // clean-up the pathname (remove the first '/')

    let requestFolder = new Request(`${STORAGE_SERVER}/${STORAGE_ZONE_NAME}/${pathname}/`, {
        headers: {
            Accept: 'application/json',
            AccessKey: `${BUNNY_STORAGE_ACCESS_KEY}`,
        },
        cf: CF_REQUEST_CACHE,
    })
    let requestFolderResponse = await fetch(requestFolder)
    const contentType = requestFolderResponse.headers.get('content-type')
    if (requestFolderResponse.ok && contentType && contentType.indexOf('application/json') !== -1) {
        let folderListing = await requestFolderResponse.json()
        if (folderListing.length == 0) {
            // path is a file
            return redirectToBunnyPullZone(`https://${PULL_ZONE}/${pathname}`, pathname, request.headers.get('cf-connecting-ip'))
            // return await getFileFromBunny(`${STORAGE_SERVER}/${STORAGE_ZONE_NAME}/${pathname}`)
        }

        // check if allow list contains entries
        if (INDEX_ALLOW_LIST.length > 0) {
            if (pathname == '') {
                // path is root /
                // filter index by allow list
                folderListing = folderListing.filter(folder => INDEX_ALLOW_LIST.includes(folder.ObjectName))
            }

            // Only show index for allowed top directories and root /
            if (path[0] == '' || INDEX_ALLOW_LIST.includes(path[0])) {
                // show folder index
                return renderFolderListing(folderListing, country)
            }
        } else {
            // allow list is empty
            // show folder index for everything
            return renderFolderListing(folderListing, country)
        }
        return new Response('404 page not found', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
    }

    // redirect to base URL on error
    return Response.redirect(`${BASE_URL}`, 302)
}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})
