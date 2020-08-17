// https://github.com/mhart/aws4fetch
// https://docs.aws.amazon.com/ses/latest/DeveloperGuide/using-ses-api-requests.html
// https://docs.aws.amazon.com/ses/latest/DeveloperGuide/using-ses-api-examples.html

import { AwsClient } from 'aws4fetch'
var qs = require('qs')

// Configuration
const REGION = 'ap-southeast-2'
const SES_BASE_URL = `https://email.${REGION}.amazonaws.com`
const ACTION = 'SendEmail'
// const AWS_ACCESS_KEY_ID = '' // set as an environment variable / secret
// const AWS_SECRET_ACCESS_KEY = ''  // set as an environment variable / secret
// const FROM = ''  // set as an environment variable / secret
// const TO = ''  // set as an environment variable / secret
let SUBJECT = 'Test Message'
let MESSAGE = 'Hello I hope you are having a good day'

// TODO
// + dynamic content
// + recaptcha
// + honeypot
// + require JS with a random digest ( changes every few minutes / the previous one is also accepted )
// + whitelist recipients
// + ratelimit?
// + html email

const AWS = new AwsClient({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: REGION,
})

/**
 * Respond
 * @param {Request} req
 */
async function sendEmail(req) {
    console.log(`Received new request: ${req.method} ${req.url}`)

    let params = {
        Action: ACTION,
        Source: FROM,
        Destination: {
            ToAddresses: {
                member: {
                    1: TO,
                },
            },
        },
        Message: {
            Body: {
                // Html: {
                //     Charset: "UTF-8",
                //     Data: "HTML_FORMAT_BODY"
                // },
                Text: {
                    Charset: 'UTF-8',
                    Data: MESSAGE,
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: SUBJECT,
            },
        },
        ReplyToAddresses: {
            member: {
                1: FROM,
            },
        },
    }

    // URL encode object to string
    params = qs.stringify(params, { allowDots: true })
    console.log(params)

    const response = await AWS.fetch(SES_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
    })

    if (response.status !== 200) {
        return response
    }
    return new Response('Message Send!', {
        headers: { 'content-type': 'text/plain' },
    })
}

export default sendEmail
