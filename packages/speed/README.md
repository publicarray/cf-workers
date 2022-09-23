## Speed Test - [DEMO](https://speed.seby.io)

This project combines [worker-speedtest-template](https://github.com/cloudflare/worker-speedtest-template) and [LibreSpeed](https://github.com/librespeed/speedtest)

```sh
# Download
curl "https://speed.seby.io/down?bytes=10000000" > /dev/null
wget -O /dev/null -q --show-progress "https://speed.seby.io/down?bytes=10000000"
# Windows PowerShell
curl "https://speed.seby.io/down?bytes=100000000" > nil

# Upload
dd if=/dev/zero bs=1000 count=3000 | curl -X POST --upload-file - "https://speed.seby.io/up" >/dev/null

dd if=/dev/urandom of=test.dat bs=1M count=10
curl --http1.1 -w '%{speed_upload}\n' -sf -o/dev/null --data-binary @test.dat https://speed.seby.io/up
curl --http2 -w '%{speed_upload}\n' -sf -o/dev/null --data-binary @test.dat https://speed.seby.io/up
# Windows PowerShell
($0 = new-object byte[] 1250000) | curl -X POST --upload-file - "https://speed.seby.io/up" >nil
```

Worker for measuring download / upload connection speed from the client side, using the [Performance Timing API](https://w3c.github.io/perf-timing-primer/).

[`index.js`](https://github.com/cloudflare/worker-speedtest-template/blob/master/router.js) is the content of the Workers script.

_Note:_ when running this as your own worker, your latency measurements may differ a small amount from the [official version](https://speed.cloudflare.com). This is due to the fact that we rely on an internal mechanism to determine the amount of server processing time, which is then subtracted from the measurement.

#### Wrangler

You can use [wrangler](https://github.com/cloudflare/wrangler) to generate a new Cloudflare Workers project based on this template by running the following command from your terminal:

```
wrangler generate myApp https://github.com/cloudflare/worker-speedtest-template
```

Before publishing your code you need to edit `wrangler.toml` file and add your Cloudflare `account_id` - more information about publishing your code can be found [in the documentation](https://workers.cloudflare.com/docs/quickstart/configuring-and-publishing/).

Once you are ready, you can publish your code by running the following command:

```
wrangler publish
```

#### Serverless

To deploy using serverless add a [`serverless.yml`](https://serverless.com/framework/docs/providers/cloudflare/) file.
