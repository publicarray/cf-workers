/*
 * source: https://github.com/BunnyWay/BunnyCDN.TokenAuthentication/tree/master/nodejs
 */

async function sha256(str) {
    const text = new TextEncoder().encode(str)
    const hashBuffer = await crypto.subtle.digest("SHA-256", text)
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    console.log('sha256', hashHex)
    return btoa(hashHex)
}

function addCountries(url, a, b) {
    var tempUrl = url;
    if (a != null && a != "") {
        var tempUrlOne = new URL(tempUrl);
        tempUrl += ((tempUrlOne.search == "") ? "?" : "&") + "token_countries=" + a;
    }
    if (b != null && b != "") {
        var tempUrlTwo = new URL(tempUrl);
        tempUrl += ((tempUrlTwo.search == "") ? "?" : "&") + "token_countries_blocked=" + b;
    }
    return tempUrl;
}

/**
 *
 * @param {string} url Requested url
 * @param {string} securityKey Url Token Authentication Key
 * @param {int} expirationTime time in seconds
 * @param {string} userIp the ip address to allow
 * @param {bool} isDirectory
 * @param {string} pathAllowed directory content to allow
 * @param {string} countriesAllowed
 * @param {string} countriesBlocked
 */
async function signUrl(url, securityKey, expirationTime = 3600, userIp, isDirectory = false, pathAllowed, countriesAllowed, countriesBlocked) {
    var parameterData = "", parameterDataUrl = "", signaturePath = "", hashableBase = "", token = "";
    var expires = Math.floor(new Date() / 1000) + expirationTime;
    var url = addCountries(url, countriesAllowed, countriesBlocked);
    var parsedUrl = new URL(url);
    var parameters = (new URL(url)).searchParams;
    if (pathAllowed != null) {
        signaturePath = pathAllowed;
        parameters.set("token_path", pathAllowed);
    } else {
        signaturePath = parsedUrl.pathname;
    }
    parameters.sort()
    console.log('parameters')
    for (var pair of parameters.entries()) {
        let key = pair[0]
        let value = pair[1]
        console.log(key, value)
        if (parameterData.length > 0) {
            parameterData += "&";
        }
        parameterData += key + "=" + value;
        parameterDataUrl += "&" + key + "=" + encodeURIComponent(value);
    }
    console.log('parameterDataUrl', parameterDataUrl);
    hashableBase = securityKey + signaturePath + expires + ((userIp != null) ? userIp : "") + parameterData;
    console.log('hashableBase', hashableBase);
    token = await sha256(hashableBase);
    token = token.replace(/\n/g, "").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    if (isDirectory) {
        return parsedUrl.protocol + "//" + parsedUrl.host + "/bcdn_token=" + token + parameterDataUrl + "&expires=" + expires + parsedUrl.pathname;
    } else {
        return parsedUrl.protocol + "//" + parsedUrl.host + parsedUrl.pathname + "?token=" + token + parameterDataUrl + "&expires=" + expires;
    }
}

export default signUrl;
