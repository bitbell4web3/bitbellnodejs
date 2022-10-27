
const SpotSymbolPrice = require('../models/index').SpotSymbolPrice;

const logger = require('log4js').getLogger("info");


const enable_status = "1";
const disable_status = "2";


async function find_with_symbol(user_id,symbol){

    let condition = {};
        condition = {
            user_id:user_id,
            symbol:symbol,
            is_del:false
        }
    let list = await SpotSymbolPrice.findAll({
        where: condition,
    });
    console.info("list:",list)
    return list;
}


async function create(user_id,symbol,rise_in_price_threshold,fall_in_price_threshold) {
    let record = await find_with_symbol(user_id,symbol);
    console.info("record:",record)
    if(record.length > 0){
        throw new Error('403015');
    }
    const model = {
        user_id:user_id,
        symbol:symbol,
        rise_in_price_threshold:rise_in_price_threshold,
        fall_in_price_threshold:fall_in_price_threshold,
        status:enable_status,
        is_del:false
    };
    let result  = await SpotSymbolPrice.create(model);
    return result;
}

async function list() {
    let list = await SpotSymbolPrice.findAll();
    return list;
}

module.exports = {
    create,
    find_with_symbol,
    list
}