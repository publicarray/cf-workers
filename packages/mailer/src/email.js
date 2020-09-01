// https://github.com/mhart/aws4fetch
// https://docs.aws.amazon.com/ses/latest/DeveloperGuide/using-ses-api-requests.html
// https://docs.aws.amazon.com/ses/latest/DeveloperGuide/using-ses-api-examples.html

import { AwsClient } from 'aws4fetch' // sign AWS API
// https://www.npmjs.com/package/xss
// https://owasp.org/www-community/xss-filter-evasion-cheatsheet
import xss from 'xss' // sanetize untrusted input
import qs from 'qs' // query string
import template from './email-template' // html template

// Configuration
const REGION = 'ap-southeast-2'
const SES_BASE_URL = `https://email.${REGION}.amazonaws.com`
const ACTION = 'SendEmail'
// const AWS_ACCESS_KEY_ID = '' // set as an environment variable / secret
// const AWS_SECRET_ACCESS_KEY = ''  // set as an environment variable / secret
// const FROM = ''  // set as an environment variable / secret // Contact Form <your_email@domain.com>
// const TO = ''  // set as an environment variable / secret // YOUR NAME <your_email@domain.com>
// let SUBJECT = 'Test Message'
// let MESSAGE = 'Hello I hope you are having a good day'

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
async function sendEmail(message, return_to, name) {
    message = xss(message)
    return_to = xss(return_to)
    name = xss(name)

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
                Html: {
                    Charset: 'UTF-8',
                    Data: template(message, {
                        subject: `New message from ${name} | seby.io`,
                        company: 'seby.io',
                        website: 'https//seby.io',
                    }),
                },
                Text: {
                    Charset: 'UTF-8',
                    Data: message,
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: `New message from ${name} | seby.io`,
            },
        },
        ReplyToAddresses: {
            member: {
                1: return_to,
            },
        },
    }

    // URL encode object to string
    params = qs.stringify(params, { allowDots: true })
    // console.log(params)

    const response = await AWS.fetch(SES_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
    })

    if (response.status !== 200) {
        return response
    }
    // if (redirectUrl) {
    //     return new Response('Message Send!', {
    //         status: 302,
    //         headers: {
    //             Location: redirectUrl,
    //         },
    //     })
    // }
    return new Response('Message Send!', {
        headers: { 'content-type': 'text/plain' },
    })

    // let ok = {status: "OK"}
    // return new Response(JSON.stringify(ok), {
    //     headers: { 'content-type': 'application/json' },
    // })
}

export default sendEmail
