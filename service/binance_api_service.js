const {
    Spot
} = require('@binance/connector');


const logger = require('log4js').getLogger("api_binance");
const config = require('config');
const {
    v4: uuidv4
} = require('uuid');



// get /api/v3/ticker/24hr 24hr 价格变动情况

function get_24hr_price(apiKey,apiSecret,callback){

    logger.info("get_24hr_price ")
    const client = new Spot(apiKey, apiSecret,{baseURL:config.baseURL})
    client.account().then(response => {
        logger.info(response.data)
        callback(null,response.data);
    })
}





// GET /api/v3/account  权重(IP): 10
function get_account_msg(apiKey, apiSecret,callback) {
    // Get account information
    logger.info("get_account_msg from prod env")
    const client = new Spot(apiKey, apiSecret,{baseURL:config.baseURL})
    client.account().then(response => {
        logger.info(response.data)
        callback(null,response.data);
    })
}


function get_account_msg_async(apiKey,apiSecret) {
    logger.info("get_account_msg_async===>");
    return new Promise(function (resolve, reject) {
        get_account_msg(apiKey,apiSecret,function (err, data) {
            if (err !== null) {
                logger.error(err);
                reject(err);
            } else {
                logger.info("new_sell_Order_async data:",data)
                resolve(data)
            }
        })
    })
}


// endpoint  /sapi/v1/capital/config/getall
function get_coins_info(apiKey, apiSecret,callback) {
    logger.info("get_coins_info from prod env")
    const client = new Spot(apiKey, apiSecret,{baseURL:config.baseURL})
    client.coinInfo().then(response => {
        logger.info(response.data)
        callback(response.data)
    })
}

// 交易规范信息
function exchangeInfo(apiKey, apiSecret,callback) {
    logger.info("exchangeInfo");
    const client = new Spot(apiKey, apiSecret,{baseURL:config.baseURL})
    client.exchangeInfo().then(response => {
        callback(null,response.data)
    })
}

function exchangeInfo_async(apiKey,apiSecret) {
    logger.info("exchangeInfo_async===>");
    return new Promise(function (resolve, reject) {
        exchangeInfo(apiKey,apiSecret,function (err, data) {
            if (err !== null) {
                logger.error(err);
                reject(err);
            } else {
                resolve(data)
            }
        })
    })
}

//深度信息 -- 盘口信息
/** BID是买入价,ASK是卖出价
 * 
             {
            "lastUpdateId": 1027024,
            "bids": [
                [
                "4.00000000",     // 价位
                "431.00000000"    // 挂单量
                ]
            ],
            "asks": [
                [
                "4.00000200",
                "12.00000000"
                ]
            ]
            }
 * 
 * 
 * @param {*} symbol 
 * @param {*} callback 
 */
function depth(apiKey, apiSecret,symbol, callback) {
    logger.info("depth");
    const client = new Spot(apiKey, apiSecret,{baseURL:config.baseURL})
    client.depth(symbol).then(response => {
        callback(response.data)
    })
}

//近期成交列表
function trades(apiKey, apiSecret,symbol, callback) {
    logger.info("trades");
    const client = new Spot(apiKey, apiSecret,{baseURL:config.baseURL})
    client.trades(symbol).then(response => {
        callback(null,response.data)
    })
}

function trades_async(apiKey,apiSecret,symbol) {
    logger.info("trades_async===>");
    return new Promise(function (resolve, reject) {
        trades(apiKey,apiSecret,symbol,function (err, data) {
            if (err !== null) {
                logger.error(err);
                reject(err);
            } else {
                resolve(data)
            }
        })
    })
}



// historicalTrades 查询历史成交
function historicalTrades(apiKey, apiSecret,symbol, callback) {
    logger.info("historicalTrades");
    const client = new Spot(apiKey, apiSecret,{baseURL:config.baseURL})
    client.historicalTrades(symbol).then(response => {
        callback(response.data)
    })
}
// /api/v3/aggTrades 近期成交(归集)

function aggTrades(apiKey, apiSecret,symbol, callback) {
    logger.info("aggTrades");
    const client = new Spot(apiKey, apiSecret,{baseURL:config.baseURL})
    client.aggTrades(symbol).then(response => {
        callback(response.data)
    })
}

// /api/v3/klines K线数据 权重为1
// https://binance-docs.github.io/apidocs/spot/cn/#12907e94be
/**
 * 以 /api/*开头的接口按IP限频，且所有接口共用每分钟1200限制。
 * 按IP和按UID(account)两种模式分别统计, 两者互相独立。
 * 
 * 以 /api/*开头的接口按IP限频，且所有接口共用每分钟1200限制。
 * 以/sapi/*开头的接口采用单接口限频模式。按IP统计的权重单接口权重总额为每分钟12000；按照UID统计的单接口权重总额是每分钟180000。
 * /api/*接口和 /sapi/*接口采用两套不同的访问限频规则, 两者互相独立。
 * @param {*} apiKey 
 * @param {*} apiSecret 
 * @param {*} symbol 
 * @param {*} interval 
 * @param {*} limit 
 * @param {*} callback 
 */

function klines(apiKey, apiSecret,symbol, interval, limit, callback) {
    const client = new Spot(apiKey, apiSecret,{baseURL:config.baseURL})
    client.klines(symbol, interval, {
        limit: limit
    }).then(response => {
        let headers = response.headers;
        let used_weight = headers['x-mbx-used-weight'];
        let used_weight_1m = headers['x-mbx-used-weight-1m'];
        logger.info("klines response used_weight ==>",used_weight," used_weight_1m:",used_weight_1m);
        if(used_weight_1m%100 === 0){
            logger.info("klines response data ==>",response.data);
        }
       
        callback(null, response.data)
    })
}

function klinesAsync(apiKey, apiSecret, symbol, interval, limit) {
    return new Promise(function (resolve, reject) {
        klines(apiKey, apiSecret,symbol, interval, limit, function (err, data) {
            if (err !== null) {
                logger.error(err);
                reject(err);
            } else resolve(data)
        })
    })
}

// /api/v3/ticker/price 获取交易对最新价格
function tickerPrice(apiKey, apiSecret,symbol, callback) {
    logger.info("tickerPrice");
    const client = new Spot(apiKey, apiSecret,{baseURL:config.baseURL})
    client.tickerPrice(symbol).then(response => {
        callback(response.data)
    })
}
// /api/v3/order 查询订单 权重(IP): 2


function getOrder(apiKey, apiSecret,symbol, callback) {
    logger.info("getOrder");
    const client = new Spot(apiKey, apiSecret,{baseURL:config.baseURL})
    client.getOrder(symbol).then(response => {
        callback(response.data)
    })
}

// /api/v3/allOrders 查询所有订单 权重(IP): 10 带有symbol

function allOrders(apiKey, apiSecret,symbol, callback) {
    logger.info("allOrders");
    const client = new Spot(apiKey, apiSecret,{baseURL:config.baseURL})
    client.allOrders(symbol).then(response => {
        let orders = response.data;
        callback(null,orders)
    })
}

function allOrdersAsync(apiKey, apiSecret,symbol) {
    return new Promise(function (resolve, reject) {
        allOrders(apiKey, apiSecret,symbol, function (err, data) {
            if (err !== null) {
                logger.error(err);
                reject(err);
            } else resolve(data)
        })
    })
}


// GET /api/v3/openOrders 当前挂单 权重(IP): 3 单一交易对;40 交易对参数缺失;

function openOrders(symbol, callback) {
    logger.info("openOrders");
    client.openOrders(symbol).then(response => {
        callback(response.data)
    })
}

// POST /api/v3/order/test 测试下单
/**
 * 
 * @param {订单方向 (方向 side):
    BUY 买入
    SELL 卖出
 * symbol
 * orderTypes    
    LIMIT 限价单
    MARKET 市价单
    STOP_LOSS 止损单 -- 注: 另一种市价单，达到触发价格时直接按市价成交
    STOP_LOSS_LIMIT 限价止损单 -- 
    TAKE_PROFIT 止盈单
    TAKE_PROFIT_LIMIT 限价止盈单
    LIMIT_MAKER 限价只挂单
 * @param {*} side 
 * @param {*} callback 
 * 购买采用限价止损单(采用限价单),卖出采用限价单 LIMIT
 * timeInForce = GTC  成交为止 订单会一直有效，直到被成交或者取消
 *  quantity = ,price = 41000
 */

function new_buy_OrderTest(apiKey, apiSecret,symbol, callback) {
    logger.info("newOrderTest");
    let side = 'BUY'
    let type = 'LIMIT'
    let timeInForce = 'GTC'
    let price = '21000'
    let quantity = '1'
    let newClientOrderId = uuidv4();
    let newOrderRespType = 'FULL'
    let options = {
        timeInForce: timeInForce,
        price: price,
        quantity: quantity,
        newClientOrderId: newClientOrderId,
        newOrderRespType: newOrderRespType
    }
    const client = new Spot(apiKey, apiSecret,{baseURL:config.baseURL})
    client.newOrderTest(symbol, side, type, options).then(response => {
        console.info("newOrderTest resp:",response)
        callback(response.data)
    })
}

/**
 * POST /api/v3/order 下单--买单
 * @param {*} symbol 
 * @param {*} callback 
 */
function new_buy_Order(apiKey,apiSecret,symbol,price,quantity,newClientOrderId, callback) {
    logger.info("new_buy_Order===>11111");
    let side = 'BUY'
    let type = 'LIMIT'
    new_Order(apiKey,apiSecret,symbol,price,quantity,type,side,newClientOrderId,function(err,data){
        callback(err,data)
    })
}
/**
 * 
 * @param {*} symbol 
 * @param {*} price 
 * @param {*} quantity 
 * @param {*} newClientOrderId 
 * @param {*} callback 
 * POST /api/v3/order 下单--卖单
 */

function new_sell_Order(apiKey,apiSecret,symbol,price,quantity, callback) {
    logger.info("new_sell_Order===>11111");
    let side = 'SELL'
    let type = 'LIMIT'
    new_Order(apiKey,apiSecret,symbol,price,quantity,type,side,null,function(err,data){
        callback(err,data)
    })
}

function new_Order(apiKey,apiSecret,symbol,price,quantity,type,side,newClientOrderId,callback){
    let timeInForce = 'GTC'
    let newOrderRespType = 'FULL'
    let options = {
        timeInForce: timeInForce,
        price: price,
        quantity: quantity,
        newClientOrderId: newClientOrderId,
        newOrderRespType: newOrderRespType
    };
    logger.info("new_Order===>222222");
    logger.info("new_Order param,newClientOrderId:",newClientOrderId," symbol:",symbol," side:",side, " options:",options)
    
    const client = new Spot(apiKey, apiSecret,{baseURL:config.baseURL})
    let response = client.newOrder(symbol, side, type, options).then(response => {
       let result = response.data;
        callback(null, result)
        logger.info("newOrder resp data:",result)
    })

}

function new_buy_Order_async(apiKey,apiSecret,symbol,price,quantity,newClientOrderId) {
    logger.info("new_buy_Order_async===>0000");
    return new Promise(function (resolve, reject) {
        new_buy_Order(apiKey,apiSecret,symbol,price,quantity,newClientOrderId,function (err, data) {
            if (err !== null) {
                logger.error(err);
                reject(err);
            } else {
                logger.info("new_buy_Order_async data:",data)
                resolve(data)
            }
        })
    })
}

function new_sell_Order_async(apiKey,apiSecret,symbol,price,quantity) {
    logger.info("new_sell_Order_async===>");
    return new Promise(function (resolve, reject) {
        new_sell_Order(apiKey,apiSecret,symbol,price,quantity,function (err, data) {
            if (err !== null) {
                logger.error(err);
                reject(err);
            } else {
                logger.info("new_sell_Order_async data:",data)
                resolve(data)
            }
        })
    })
}

function new_fast_buy_order_async(apiKey,apiSecret,symbol,quoteOrderQty,newClientOrderId){
    logger.info("new_fast_buy_order_async===>");
    return new Promise(function (resolve, reject) {
        new_fast_buy_order(apiKey,apiSecret,symbol,quoteOrderQty,newClientOrderId,function (err, data) {
            if (err !== null) {
                logger.error(err);
                reject(err);
            } else {
                logger.info("new_fast_buy_order_async data:",data)
                resolve(data)
            }
        })
    })

}

function new_fast_buy_order(apiKey, apiSecret,symbol,quoteOrderQty,newClientOrderId,callback){
    let newOrderRespType = 'FULL'
    let side = 'BUY'
    let type = 'MARKET'
    let options = {
        quoteOrderQty: quoteOrderQty,
        newClientOrderId: newClientOrderId,
        newOrderRespType: newOrderRespType
    };
    logger.info("new_fast_buy_order param,newClientOrderId:",newClientOrderId," symbol:",symbol," side:",side, " options:",options)
    const client = new Spot(apiKey, apiSecret,{baseURL:config.baseURL})
    let response = client.newOrder(symbol, side, type, options).then(response => {
       let result = response.data;
        callback(null, result)
        logger.info("new_fast_buy_order resp data:",result)
    })


}






exports = module.exports = {
    new_fast_buy_order_async,
    new_sell_Order_async,
    new_sell_Order,
    new_buy_Order_async,
    new_buy_Order,
    new_buy_OrderTest,
    openOrders,
    allOrders,
    getOrder,
    tickerPrice,
    klines,
    klinesAsync,
    aggTrades,
    historicalTrades,
    trades,
    depth,
    get_account_msg,
    get_account_msg_async,
    get_coins_info,
    exchangeInfo,
    exchangeInfo_async,
    trades_async,
    allOrdersAsync
}