const strategy_dao = require('../dao/strategy_dao')
const user_binance_api_dao = require('../dao/user_wallet_info_dao')
const logger = require('log4js').getLogger("info");

exports.list_normal_strategies = async (user_id) => {

    let result = await strategy_dao.list_normal_strategies(user_id);
    return result
}
//创建策略
exports.create_strategy = async (user_id, symbol, kind, total_money, buy_method,
    sell_method,
    inspect_buy_price, inspect_buy_reduce_rate,
    inspect_sell_price, inspect_sell_raise_rate) => {

    let result = await strategy_dao.create(user_id, symbol, kind, total_money, buy_method, sell_method,
        inspect_buy_price, inspect_buy_reduce_rate,
        inspect_sell_price, inspect_sell_raise_rate);

    logger.info("create_strategy:", result)
}
//修改策略购买价格
exports.update_strategy_buy_price = async (user_id, strategy_id,
    inspect_buy_price) => {

    let result = await strategy_dao.update_buy_price(strategy_id, user_id, inspect_buy_price);
    logger.info("update_strategy_buy_price:", result)
}
//修改购买策略的下跌率
exports.update_strategy_buy_reduce_rate = async (user_id, strategy_id,
    inspect_buy_reduce_rate) => {
    let result = await strategy_dao.update_buy_reduce_rate(strategy_id, user_id, inspect_buy_reduce_rate);
    logger.info("update_strategy_buy_reduce_rate:", result)
}

//修改策略卖出价格
exports.update_strategy_sell_price = async (user_id, strategy_id,
    inspect_sell_price) => {

    let result = await strategy_dao.update_buy_price(strategy_id, user_id, inspect_sell_price);
    logger.info("update_strategy_sell_price:", result)
}
//修改策略卖出的上涨率
exports.update_strategy_sell_raise_rate = async (user_id, strategy_id,
    inspect_sell_raise_rate) => {
    let result = await strategy_dao.update_sell_raise_rate(strategy_id, user_id, inspect_sell_raise_rate);
    logger.info("update_strategy_sell_raise_rate:", result)
}

//获取用户appkey
exports.get_app_key = async (user_id) => {
    let result = await user_binance_api_dao.find_one(user_id);
    return result
}
//策略状态为待卖出
exports.update_run_stage_pre_sell = async (user_id, strategy_id) => {
    await strategy_dao.update_run_stage(strategy_dao.run_stage_pre_sell, strategy_id, user_id);
}
//策略状态为待买入
exports.update_run_stage_pre_buy = async (user_id, strategy_id) => {
    await strategy_dao.update_run_stage(strategy_dao.run_stage_pre_buy, strategy_id, user_id);
}

//策略状态为已卖出
exports.update_run_stage_have_sell = async (user_id, strategy_id) => {
    await strategy_dao.update_run_stage(strategy_dao.run_stage_have_sell, strategy_id, user_id);
}