const coin_surprise_dao = require('../dao/coin_surprise_dao')
const logger = require('log4js').getLogger("coin_surprise");
let mail_service = require('../mail')
const binance_api_service = require('../service/binance_api_service');
const Decimal = require('decimal.js');
Decimal.set({ rounding: Decimal.ROUND_DOWN })

// 每秒1次 600次则是10分钟
let send_mail_interval_times = 600


let send_mail_map = new Map()


exports.list_normal_coin_surprise = async () => {
    let result = await coin_surprise_dao.list_normal_coin_surprise();
    return result
}
//创建策略
exports.create = async (symbol,
    line_type,
    rise_rate) => {
    await coin_surprise_dao.create(symbol,
        line_type,
        rise_rate);

}

// 监控某一币种异动
exports.spot_coin_fast_rise = async (coin_surprise, user_info) => {

    let symbol = coin_surprise.symbol
    let coin_surprise_id = coin_surprise.id
    let line_type = coin_surprise.line_type;
    let user_mail = user_info.user_mail ;
    let app_key = user_info.app_key
    let app_secret = user_info.app_secret
    //5.调用远程API
    let get_current_price_max_price_result = await get_current_price_max_price(app_key, app_secret, symbol,line_type)

    // 当前价格与N分钟K线价格做比较如果上涨率大于等于策略设置比率则直接买入
    let current_price = get_current_price_max_price_result.current_price
    //N分钟开盘价
    let start_price = get_current_price_max_price_result.start_price;
    //比较上涨率
    let start_price_decimal = new Decimal(start_price)
    let current_price_decimal = new Decimal(current_price);
    let diff_price_current_start = current_price_decimal.minus(start_price_decimal);
    //上涨下跌率
    let rise_reduce_rate = diff_price_current_start.div(start_price_decimal)
    let expect_rate = coin_surprise.rise_rate;
    let diff = rise_reduce_rate.minus(new Decimal(expect_rate));
    let send_mail_key = coin_surprise_id;
    logger.info("spot_coin_fast_rise rise_rate:", rise_reduce_rate.toFixed(5), " symbol:", symbol, " start_price:", start_price, " current_price:", current_price," coin_surprise_id:",coin_surprise_id)
    if (diff >= 0) {
        logger.info("**** spot_coin_fast_rise ***** rise_rate:", rise_reduce_rate.toFixed(5), " symbol:", symbol, " start_price:", start_price, " current_price:", current_price," coin_surprise_id:",coin_surprise_id)
        let param = {
            type: 'spot_coin_fast_rise',
            symbol: symbol,
            start_price: start_price,
            current_price: current_price,
            coin_surprise_id: coin_surprise_id,
            rise_rate:rise_reduce_rate.toFixed(5),
            received_mail: user_mail
        }
        will_send_spot_coin_fast_rise_email(send_mail_map,send_mail_key,param);
    }
}

async function get_current_price_max_price(app_key, app_secret, symbol, line_type) {
    let interval = line_type
    let limit = 1;
    let result = await binance_api_service.klinesAsync(app_key, app_secret, symbol, interval, limit);
    let max_price = result[0][2]
    //开盘价
    let start_price = result[0][1]
    let current_price = result[0][4]
    let value = {
        max_price: max_price,
        current_price: current_price,
        start_price: start_price
    }
    return value
}

async function will_send_spot_coin_fast_rise_email(send_mail_map, key, param) {


    if (send_mail_map.has(key)) {
        let map_value = send_mail_map.get(key)
        let new_value = map_value + 1;
        send_mail_map.set(key, new_value)
    } else {
        send_mail_map.set(key, 0)
    }
    let current_map_value = send_mail_map.get(key)
    if (current_map_value % send_mail_interval_times == 0) {
        mail_service.send_spot_coin_fast_rise_email(param);
    }
}