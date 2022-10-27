const strategy_order_dao = require('../dao/strategy_order_dao')
const logger = require('log4js').getLogger("info");


//创建策略订单
exports.create_strategy_order = async (user_id, strategy_id, symbol, order_id, buy_price_unit, max_level_price, buy_total_money, buy_amount) => {
    let result = await strategy_order_dao.create(user_id, strategy_id, symbol, order_id, buy_price_unit, max_level_price, buy_total_money, buy_amount);
    logger.info("create_strategy_order:", result)
}



