import qr from 'qr-image'
import { getAssetFromKV } from "@cloudflare/kv-asset-handler";

const generate = async request => {
    const { searchParams } = new URL(request.url)
    let text = 'https://qr.seby.io'
    let format = 'png'
    if (searchParams.has('text')) {
        text = searchParams.get('text')
        if (searchParams.has('format')) {
            format = searchParams.get('format')
        }
    } else {
        let json = {}
        try {
            // for POST that are not json
            json = await request.json()
        } catch (error) {
            return new Response('400 Bad request', {
                status: 400,
                headers: { 'Content-Type': 'text/plain' },
            })
        }
        text = json.text || ''
        format = json.format || 'png'
    }
    let headers = {}
    let img
    if (format == 'svg') {
        headers = { 'Content-Type': 'image/svg+xml' }
        img = qr.imageSync(text, { type: 'svg' })
    } else {
        headers = { 'Content-Type': 'image/png' }
        img = qr.imageSync(text, { size: 18, margin: 1 })
    }
    return new Response(img, { headers })
}

async function handleRequest(event) {
    let request = event.request
    let response
    let { searchParams, pathname} = new URL(request.url)
    console.log(searchParams, pathname, searchParams.has('text'))
    if (request.method === 'POST' || searchParams.has('text')) {
        response = await generate(request)
    } else {
        try {
            response = await getAssetFromKV(event)
        } catch (e) {
            let pathname = new URL(event.request.url).pathname;
            return new Response(`"${pathname}" not found`, {
                status: 404,
                statusText: "not found",
            })
        }
    }
    return response
}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event))
})
