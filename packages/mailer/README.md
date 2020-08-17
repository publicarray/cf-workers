# Send ✉️ via AWS SES


#### Wrangler

To generate using [wrangler](https://github.com/cloudflare/wrangler)

```
npm i
wrangler secret put AWS_ACCESS_KEY_ID
wrangler secret put AWS_SECRET_ACCESS_KEY
wrangler secret put FROM
wrangler secret put TO
wrangler dev
```

Further documentation for Wrangler can be found [here](https://developers.cloudflare.com/workers/tooling/wrangler).
