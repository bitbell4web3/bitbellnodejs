const fast_strategy_dao = require('../dao/fast_strategy_dao')
const user_binance_api_dao = require('../dao/user_binance_api_dao')
const logger = require('log4js').getLogger("fast_strategy");

exports.list_normal_fast_strategies = async (user_id) => {
    let result = await fast_strategy_dao.list_normal_strategies(user_id);
    return result
}
//创建策略
exports.create_fast_strategy = async (user_id, symbol, kind, total_money,  sell_method,
    expect_buy_rate,
    expect_sell_profit, expect_sell_raise_rate) => {

    let result = await fast_strategy_dao.create(user_id, symbol, kind, total_money,  sell_method,
        expect_buy_rate,
        expect_sell_profit, expect_sell_raise_rate);

}


//获取用户appkey
exports.get_app_key = async (user_id) => {
    let result = await user_binance_api_dao.find_one(user_id);
    return result
}
//策略状态为待卖出
exports.update_run_stage_pre_sell = async (user_id, fast_strategy_id) => {
    let result = await fast_strategy_dao.update_run_stage(fast_strategy_dao.run_stage_pre_sell, fast_strategy_id, user_id);
    return result 
}
//策略状态为待买入
exports.update_run_stage_pre_buy = async (user_id, fast_strategy_id) => {
    let result = await fast_strategy_dao.update_run_stage(fast_strategy_dao.run_stage_pre_buy, fast_strategy_id, user_id);
    return result 
}

//策略状态为已卖出
exports.update_run_stage_have_sell = async (user_id, fast_strategy_id) => {
    let result = await fast_strategy_dao.update_run_stage(fast_strategy_dao.run_stage_have_sell, fast_strategy_id, user_id);
    return result 
}