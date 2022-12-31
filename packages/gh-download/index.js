export default {
    async fetch(request, env) {
        return await handleRequest(request).catch(
            (err) => new Response(err.stack, { status: 500 })
        )
    },
}

/**
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function handleRequest(request) {
    const { searchParams, pathname } = new URL(request.url)

    if (pathname == "/") {
        return new Response(
            "Having trouble getting a direct link to the latest release on github?\nTry adding a path: https://gh.seby.io/$user/$reposetory\nFor Example: https://gh.seby.io/lostindark/DriverStoreExplorer\nIf there are multiple assets you can match againt the file name otherwise the first one is returned\nE.g. https://gh.seby.io/Klocman/Bulk-Crap-Uninstaller?name=portable or https://gh.seby.io/Klocman/Bulk-Crap-Uninstaller?name=setup",
            {
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                },
            }
        )
    }

    // todo validate pathname

    let ghApiResponse = await fetch(
        `https://api.github.com/repos${pathname}/releases/latest`,
        {
            headers: {
                Accept: "application/vnd.github+json",
                "User-Agent": "gh-download-redirect/1.0 <https://gh.seby.io>",
                "X-GitHub-Api-Version": "2022-11-28",
            },
            cf: {
                cacheTtl: 86400,
                cacheEverything: true,
            },
        }
    )
    if (!ghApiResponse.ok) {
        return ghApiResponse
    }

    let json = await ghApiResponse.json()
    // console.log(json.assets)
    var downloadURL = json.assets[0].browser_download_url
    // if there are multiple assets allow user to search based on file name
    if (searchParams.has("name")) {
        let name = searchParams.get("name")
        for (let i = 0; i < json.assets.length; ++i) {
            let asset = json.assets[i]
            // console.log(asset, asset.name.toLowerCase().includes(name.toLowerCase()))
            if (asset.name.toLowerCase().includes(name.toLowerCase())) {
                // update download URL
                downloadURL = asset.browser_download_url
                break
            }
        }
        // json.assets.forEach((asset) => {
        //   console.log(asset, asset.name.toLowerCase().includes(name.toLowerCase()))
        //   if (asset.name.toLowerCase().includes(name.toLowerCase())) {
        //     // update download URL
        //     downloadURL = asset.browser_download_url
        //   }
        // });
    }

    return Response.redirect(downloadURL, 302)
}
