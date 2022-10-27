const fast_strategy_order_dao = require('../dao/fast_strategy_order_dao')
const logger = require('log4js').getLogger("fast_strategy");


//创建快速策略订单
exports.create_fast_strategy_order = async (user_id, fast_strategy_id, symbol, order_id, buy_price_unit,  buy_total_money, buy_amount) => {
    let result = await fast_strategy_order_dao.create(user_id, fast_strategy_id, symbol, order_id, buy_price_unit, buy_total_money, buy_amount);
    return result 
}



