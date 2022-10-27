const kline_dao = require('../dao/kline_dao')
const logger = require('log4js').getLogger("kline");

const binance_api_service = require('../service/binance_api_service')
const moment = require('moment')
const Decimal = require('decimal.js');

//生成k线图
exports.create_kline_data = async (app_key, app_secret, symbol, line_type) => {
    logger.info("create_kline_data symbol:" + symbol + " line_type:" + line_type)
    let recently_kline = await kline_dao.list_recently_kline(symbol, line_type);
    // logger.info("recently_kline:", recently_kline)
    let interval = line_type
    if (recently_kline == null) {
        // logger.info("limit=====>1000000")
        let limit = get_kline_limit_in_init_by_interval(line_type);
        //大概一天的数据
        let result = await binance_api_service.klinesAsync(app_key, app_secret, symbol, interval, limit);
        // logger.info("result:", result.length)
        await insert_update_kline(result, symbol, line_type);

    } else {
        let end_time = recently_kline.end_time;
        let current_time = moment();
        // console.info("current_time:",current_time);
        let end_time_moment = moment(end_time);
        // console.info("end_time_moment:",end_time_moment);
        let diff = current_time.diff(end_time_moment, 'minutes')
        // console.info("diff:", diff)
        let interval_div_number = get_minius_time_div_number_by_interval(line_type)
        // console.info("interval_div_number:",interval_div_number)
        let limit = Math.ceil(diff / interval_div_number)
        if(limit <= 0 ){
            limit = 1
        }
        // console.info("diff:", diff, "limit:", limit)
        let result = await binance_api_service.klinesAsync(app_key, app_secret, symbol, interval, limit);
        // logger.info("diff result:", result.length)
        let start_time = recently_kline.start_time;
        await insert_update_kline(result, symbol, line_type,true,start_time);

    }

}

async function insert_update_kline(result, symbol, line_type, is_update, update_start_time) {
    for (let i = 0; i < result.length; i++) {

        let element = result[i];
        let start_time = element[0]
        //开盘价
        let start_price = element[1]

        let start_price_decimal = new Decimal(start_price)
        //最高价
        let high_price = element[2]
        let high_price_decimal = new Decimal(high_price)
        //最低价
        let low_price = element[3]
        let low_price_decimal = new Decimal(low_price)
        //当前价/收盘价
        let end_price = element[4]
        let end_price_decimal = new Decimal(end_price)

        //成交量
        let volume = element[5]
        //成交量
        let end_time = element[6]
        //成交量
        let volume_usdt = element[7]
        //涨跌幅 
        let diff_price_end_start = end_price_decimal.minus(start_price_decimal);
        let rise_reduce_rate = diff_price_end_start.div(start_price_decimal)
        //振幅
        let diff_shock = high_price_decimal.minus(low_price_decimal)
        let shock_rate = diff_shock.div(low_price_decimal)
        let rise_reduce_rate_str = rise_reduce_rate.toString();
        let shock_rate_str = shock_rate.toString();
        //最新一条记录为更新
        if (is_update && update_start_time == start_time) {
            await kline_dao.upate_by_start_time(symbol,
                line_type,
                start_time,
                end_time,
                start_price,
                end_price,
                high_price,
                low_price,
                rise_reduce_rate_str,
                shock_rate_str, volume_usdt);

        } else {
            //默认都是新增
            await kline_dao.create(symbol,
                line_type,
                start_time,
                end_time,
                start_price,
                end_price,
                high_price,
                low_price,
                rise_reduce_rate_str,
                shock_rate_str, volume_usdt);
        }

    }
}


exports.del_two_days_data = async () => {
    await kline_dao.del_two_days_data();
}


exports.list_recently_kline = async (symbol, line_type) => {
    await kline_dao.list_recently_kline(symbol, line_type);
}

 function get_kline_limit_in_init_by_interval(line_type){
    if(line_type == '1m'){
        return 60*24
    }else if(line_type == '3m'){
        return 60*24/3
    }else if(line_type == '5m'){
        return 60*24/5
    }else if(line_type == '15m'){
        return 60*24/15
    }else if(line_type == '30m'){
        return 60*24/30
    }else if(line_type == '1h'){
        return 60*24/60
    }else if(line_type == '4h'){
        return 24/4
    }else{
        return 1
    }
}

/**
 * 获取剩余记录时的除数
 */
 function get_minius_time_div_number_by_interval (line_type){
    if(line_type == '1m'){
        return 1
    }else if(line_type == '3m'){
        return 3
    }else if(line_type == '5m'){
        return 5
    }else if(line_type == '15m'){
        return 15
    }else if(line_type == '30m'){
        return 30
    }else if(line_type == '1h'){
        return 60
    }else if(line_type == '4h'){
        return 60*4
    }else{
        return 60*24
    }
}