const crypto = require('crypto')

const buildQueryString = params => {
    if (!params) return ''
    return Object.entries(params)
        .map(stringifyKeyValuePair)
        .join('&')
}

const stringifyKeyValuePair = ([key, value]) => {
    const valueString = Array.isArray(value) ? `["${value.join('","')}"]` : value
    return `${key}=${encodeURIComponent(valueString)}`
}


function crypt_myvalue(params) {
                   //zlTqfyTX2Qovv8mZbDmcWluUluEm64906NnpF1JEN0gxM99eKvuWN6yp7hrAih9u
    let apiSecret = "Ja9prY513G7J21GeBnWxiHDOll1ouAtoK6b050EIwQoK0OEWVCkZKTHFTLburaXr"
    // let apiSecret = "my secret and secure key";
    // const timestamp = Date.now()
    const timestamp = 1649246783788
    console.info("timestamp:",timestamp);
    // const queryString = buildQueryString({
    //     ...params,
    //     timestamp
    // })1649252341438
    const queryString = "interval=1d&limit=1&symbol=ETHUSDT&timestamp=1649261545810";
    console.info("queryString:",queryString)
    const signature = crypto
        .createHmac('sha256', apiSecret)
        .update(queryString)
        .digest('hex')

        console.info("signature:",signature)
        // 5284cc0133fbda8c8cc0866d03dac5e6f17cb9bd55e0c30538dc44ae2b02ca25
        // 5284cc0133fbda8c8cc0866d03dac5e6f17cb9bd55e0c30538dc44ae2b02ca25
        // rust 6b7f42e1adb37d1288b1bf6113dfdeb6e0efab20e77e8d9d7a7c8b6aea72971f
        // rust   5d63a39266e4004ab39bdd1162f08b7b02aaa1f2c1dbbd0297f580a6af6041ca
        // nodejs 0d0cdc121fbdcd6bf0ab6f42b35efffd3477ced219a2446ae6096c3ba184c0ff
        // rust   param: interval=1d&limit=1&symbol=ETHUSDT&timestamp=1649246783788
         // rust  param: interval=1d&limit=1&symbol=ETHUSDT&timestamp=1649246783788
        // nodejs param: interval=1d&limit=1&symbol=ETHUSDT&timestamp=1649246783788

}

let param = {"interval":"1d","limit":1,"symbol":"ETHUSDT"}
crypt_myvalue(param)