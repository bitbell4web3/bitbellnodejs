const spot_symbol_price_dao = require('../dao/spot_symbol_price_dao')
const logger = require('log4js').getLogger("info");
const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt')
exports.create = async ctx => {
  try {
    const validator = ctx.validator;
    const data = ctx.request.body;
    const user = ctx.user;
    const user_id = user.id;
    logger.info("controller spot_symbol_price create data=====>:", data)
    // user_id,symbol,rise_in_price_threshold,fall_in_price_threshold

    let symbol = data.symbol
    let rise_in_price_threshold = data.rise_in_price_threshold
    let fall_in_price_threshold = data.fall_in_price_threshold
    validator.check(symbol).notEmpty();
    validator.check(rise_in_price_threshold).notEmpty();
    validator.check(fall_in_price_threshold).notEmpty();
    console.info("user_id:",user_id," symbol:",symbol)
    let exists_list = await spot_symbol_price_dao.find_with_symbol(user_id,symbol);
    if (exists_list.length > 0) {
      return ctx.error("403016");
    }
    let result = await spot_symbol_price_dao.create(user_id,symbol,rise_in_price_threshold,fall_in_price_threshold)
    ctx.success(result);
  } catch (err) {
    logger.error("err=========>:", err)
    ctx.error(err);
  }
};




exports.list = async ctx => {
  try {
    const list = await spot_symbol_price_dao.list()
    ctx.success(list);
  } catch (err) {
    ctx.error(err);
    logger.error("err:", err)
  }
};