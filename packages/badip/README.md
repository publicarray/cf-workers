# badip API

## Usage:

Note: By default this API queries https://ipinfo.io/

I recommend to use [jq](https://stedolan.github.io/jq/) or [jql](https://github.com/yamafaktory/jql) to refine the result

```
curl -s 'https://badip.seby.io/31.132.211.144?api=xforce' | jq .score

curl -s 'https://badip.seby.io/31.132.211.144?api=signal' | jq "{overallscore:.fullip.score}, .fullip.badip, {asn: .fullip.whois.asn}"

curl -s 'https://badip.seby.io/31.132.211.144?api=signal' | jql '"fullip"."score", "fullip"."badip", "fullip"."whois"."asn"'
```

Or just pretty-print the full response:

```
curl -s 'https://badip.seby.io/31.132.211.144' | jq

curl -s 'https://badip.seby.io/31.132.211.144' | jql .
```

### Why create it?

I wanted an easier URL to remember to `curl` these APIs

#### Wrangler

```
wrangler preview -u https://example.com/1.1.1.1
```

Further documentation for Wrangler can be found [here](https://developers.cloudflare.com/workers/tooling/wrangler).
