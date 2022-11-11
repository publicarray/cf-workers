import qr from 'qr-image'

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

const landing = `<!DOCTYPE html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>QR Generator</title>
    <style>
    :root { /* light ☀️ */
        color-scheme: light dark;
        --font-color: #000;
        --bg-color: #f1f1f1;
    }
    /* https://caniuse.com/#feat=prefers-color-scheme */
    @media (prefers-color-scheme: dark) {
        :root { /* dark 🌘 */
            --font-color: #e6eaea;
            --bg-color: #222326;
        }
    }
    *, ::after, ::before {
        box-sizing: border-box;
        border-width: 0;
        border-style: solid;
        border-color: #e2e8f0;
    }
    body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif;
        background: var(--bg-color);
        color: var(--font-color);
        transition: color ease 0.5s, background ease 0.5s;
    }
    /* https://tailwindcss.com/ */
    .w-full {
        width: 100%;
    }
    .px-3 {
        padding-left: 0.75rem;
        padding-right: 0.75rem;
    }
    .py-2 {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
    }
    .mb-6 {
        margin-bottom: 1.5rem;
    }
    .mx-auto {
        margin-left: auto;
        margin-right: auto;
    }
    .my-6 {
        margin-top: 1.5rem;
        margin-bottom: 1.5rem;
    }
    .flex-wrap {
        flex-wrap: wrap;
    }
    .flex {
        display: flex;
    }
    .rounded {
        border-radius: 0.25rem;
    }
    .tracking-wide {
        letter-spacing: .025em;
    }
    .uppercase {
        text-transform: uppercase;
    }
    .mb-2 {
        margin-bottom: 0.5rem;
    }
    .text-xs {
        font-size: .75rem;
    }
    .font-bold {
        font-weight: 700;
    }
    .block {
        display: block;
    }
    .shadow {
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%);
    }
    .shadow-md {
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 10%), 0 2px 4px -1px rgb(0 0 0 / 6%);
    }
    .flex-wrap {
        flex-wrap: wrap;
    }
    .flex {
        display: flex;
    }
    .relative {
        position: relative;
    }
    .leading-tight {
        line-height: 1.25;
    }
    .border {
        border-width: 1px;
    }
    .rounded {
        border-radius: 0.25rem;
    }
    .appearance-none {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
    }
    .whitespace-pre {
        white-space: pre;
    }
    .overflow-x-auto {
        overflow-x: auto;
    }
    .bg-blue {
        --bg-opacity: 1;
        background-color: #4299e1;
        background-color: rgba(66,153,225,var(--bg-opacity));
    }
    .bg-blue:hover {
        --bg-opacity: 1;
        background-color: #2c5282;
        background-color: rgba(44,82,130,var(--bg-opacity));
    }
    [type=button], [type=reset], [type=submit], button {
        -webkit-appearance: button;
    }
    [role=button], button {
        cursor: pointer;
        font-size: 100%;
    }
    focus-outline-none:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
    }
    .container {
        width: 100%;
    }
    @media (min-width: 640px) {
        .container {
            max-width: 640px;
        }
    }
    @media (min-width: 768px) {
        .container {
            max-width: 768px;
        }
        .md-max-w-screen-sm {
            max-width: 640px;
        }
        .md-flex-1 {
            flex: 1 1 0%;
        }
        .md-w-64 {
            width: 16rem;
        }
    }
    @media (min-width: 1024px) {
        .container {
            max-width: 1024px;
        }
    }
    @media (min-width: 1280px) {
        .container {
            max-width: 1280px;
        }
    }
    </style>
</head>
<body class="container mx-auto">
    <h1 class="block text-grey-800 text-3xl font-bold">QR Generator</h1>
    <p >Click the below button to generate a new QR code.</p>
    <div class="bg-white shadow-md rounded flex flex-wrap my-6 md-max-w-screen-sm mx-auto">
        <div class="w-full md-flex-1 px-3 mb-6">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="text">Text to encode:</label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-800 leading-tight focus-outline-none focus-shadow-outline" type="text" id="text" value="https://qr.seby.io"></input>
        </div>
        <br>
        <div class="w-full inline-block relative md-w-64 px-3 mb-6">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="fileFormat">Choose a File Format:</label>
            <select class="block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus-outline-none focus-shadow-outline" id="fileFormat">
                <option value="png">PNG</option>
                <option value="svg">SVG</option>
            </select>
        </div>
        <br>
        <div class="w-full px-3 mb-6">
            <button class="bg-blue text-white font-bold py-2 px-4 rounded focus-outline-none focus-shadow-outline" type="submit" onclick="generate()">Generate QR Code</button>
        </div>
        <div class="w-full px-3 mb-6 mx-auto" style="max-width:500px;" id="result"></div>
    </div>
<div class="flex">
<pre class="whitespace-pre overflow-x-auto">curl 'https://qr.seby.io/' --get -d 'text=https://qr.seby.io' -d 'format=svg'
curl 'https://qr.seby.io/' --data-raw '{"text":"https://google.com","format":"svg"}'</pre>
</div>

<script>
    async function generate() {
        let fileFormat = document.querySelector("#fileFormat").value
        let qrRespose = await fetch(window.location.pathname, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: document.querySelector("#text").value, format: fileFormat })
        })
        let qr = await qrRespose.blob()
        let result = document.getElementById("result")

        if (fileFormat == "svg") {
            let svg = await qr.text()
            result.innerHTML = '<a href=\\'data:image/svg+xml;utf8,'+svg+'\\' download="qr-code.svg">'+svg+'</a>'
        } else if (fileFormat == "png" || fileFormat == "filereader-png") {
            cleanupOldImages(result)
            let reader = new FileReader();
            reader.readAsDataURL(qr);
            reader.onloadend = () => {
                let image = new Image()
                image.src = reader.result
                result.appendChild(image)
            }
        } else if (fileFormat == "objecturl-png") {
            // https://gist.github.com/owencm/ecc4589e67abb22cca29ea2b565db8e6
            let png = URL.createObjectURL(qr)
            let image = new Image()
            image.onload = () => {
                URL.revokeObjectURL(png)
            }
            image.src = png
        }

    }

    function cleanupOldImages(result) {
        if (result.hasChildNodes()) {
            while (result.firstChild) {
                result.removeChild(result.firstChild);
            }
        }
        result.innerHTML = '';
    }
</script>
</body>
`

async function handleRequest(request) {
    let response
    let { searchParams } = new URL(request.url)
    console.log(searchParams, searchParams.has('text'))
    if (request.method === 'POST' || searchParams.has('text')) {
        response = await generate(request)
    } else {
        response = new Response(landing, {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
            },
        })
    }
    return response
}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})
