# QR Code Generator, built with Workers - [Demo](https://qr.seby.io)

This is a modified version with a browser preview and optional SVG format

```
curl 'https://qr.seby.io/' --get -d 'text=https://qr.seby.io' -d 'format=svg'
curl 'https://qr.seby.io/' --data-raw '{"text":"https://google.com","format":"svg"}'
```

![Example](https://developers.cloudflare.com/workers/tutorials/build-a-serverless-function/media/demo.png)

There is a [tutorial available](https://developers.cloudflare.com/workers/tutorials/build-a-serverless-function/) if you would like more details on how this works.

https://github.com/signalnerve/workers-qr-code-generator

#### Wrangler

To generate using [wrangler](https://github.com/cloudflare/wrangler)

```
wrangler generate projectname https://github.com/publicarray/cf-workers/packages/qr-code
wranger dev
```

Further documentation for Wrangler can be found [here](https://developers.cloudflare.com/workers/tooling/wrangler).
