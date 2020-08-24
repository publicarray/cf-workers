 import qr from 'qr-image'

const generate = async (request) => {
    const { text, format } = await request.json()
    let headers = { 'Content-Type': 'image/png' }
    let img = null
    if (format == "svg") {
        headers = { 'Content-Type': 'image/svg' }
        img = qr.imageSync(text || 'https://qr.seby.io',  { type: 'svg' })
    } else {
        img = qr.imageSync(text || 'https://qr.seby.io', { size: 15 })
    }
    return new Response(img, { headers })
}

const landing = `<!DOCTYPE html>
<h1>QR Generator</h1>
<p>Click the below button to generate a new QR code.</p>
<label for="text">Text to encode:</label>
<input type="text" id="text" value="https://qr.seby.io"></input>
<br>
<label for="fileFormat">Choose a File Format:</label>
<select id="fileFormat">
<option value="png">PNG</option>
<option value="svg">SVG</option>
</select>
<br>
<button onclick="generate()">Generate QR Code</button>

<div style="max-width:500px;" id="result">

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
`

async function handleRequest(request) {
    let response
    if (request.method === 'POST') {
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
