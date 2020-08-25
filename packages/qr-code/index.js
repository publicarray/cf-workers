import qr from 'qr-image'

const generate = async (request) => {
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
        try {// for POST that are not json
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
        img = qr.imageSync(text, { size: 15 })
    }
    return new Response(img, { headers })
}

const landing = `<!DOCTYPE html>
<head>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@1/dist/tailwind.min.css" rel="stylesheet"></link>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>QR Generator</title>
</head>
<body class="container mx-auto">
    <h1 class="block text-grey-800 text-3xl font-bold">QR Generator</h1>
    <p >Click the below button to generate a new QR code.</p>
    <div class="bg-white shadow-md rounded flex flex-wrap my-6 md:max-w-screen-sm mx-auto">
        <div class="w-full md:flex-1 px-3 mb-6">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="text">Text to encode:</label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-800 leading-tight focus:outline-none focus:shadow-outline" type="text" id="text" value="https://qr.seby.io"></input>
        </div>
        <br>
        <div class="w-full inline-block relative md:w-64 px-3 mb-6">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="fileFormat">Choose a File Format:</label>
            <select class="block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" id="fileFormat">
                <option value="png">PNG</option>
                <option value="svg">SVG</option>
            </select>
        </div>
        <br>
        <div class="w-full px-3 mb-6">
            <button class="bg-blue-500 hover:bg-blue-800 text-white font-bold ml-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" onclick="generate()">Generate QR Code</button>
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
            result.innerHTML = await qr.text()
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

addEventListener('fetch', (event) => {
    event.respondWith(handleRequest(event.request))
})
