const Decimal = require('decimal.js');
Decimal.set({
    rounding: Decimal.ROUND_DOWN
})
const moment = require('moment')

function test_will_sell_quantity() {
    let reduce_rate_threshold = 0.03
    let raise_rate_threshold = 0.03
    let value = new Decimal('-6.2')
    let flag = value.minus(1) > 0
    console.info("value:", flag)
    //张宽敞
    // let origQty = "0.2667" 

    //李刚
    // let origQty = "0.2788" 

    //冯斌
    let origQty = "2.6575"

    let own_compute_commision = new Decimal(origQty).times(0.001)
    let real_buy_quantity = new Decimal(origQty).minus(own_compute_commision);
    console.info("real_buy_quantity:", real_buy_quantity);
}

function test_will_get_profit(buy_price_str, buy_total_money_str, will_sell_price_str) {
    let buy_price = new Decimal(buy_price_str)
    let buy_total_money = new Decimal(buy_total_money_str);
    let quantity = buy_total_money.div(buy_price);
    // let quantity = '5.7';
    
    let will_sell_price = new Decimal(will_sell_price_str)
    //售卖金额
    let will_sell_total_money = will_sell_price.times(quantity);
    //售卖佣金
    let will_sell_commission = will_sell_total_money.times(0.001);
    let profit = will_sell_total_money.times(1 - 0.001).minus(buy_total_money)
    let real_sell_total = will_sell_total_money.times(1 - 0.001);

    console.info("buy_total_money:", buy_total_money, " quantity:",quantity," real_sell_total:", real_sell_total, " profilt:", profit)
    console.info("will_sell_total_money:", will_sell_total_money, " will_sell_commission:", will_sell_commission)
}
let buy_price_str = "0.0286";
let buy_total_money_str = "8000";
let will_sell_price_str = "0.029172"
test_will_get_profit(buy_price_str, buy_total_money_str, will_sell_price_str);



function test_fast_get_profit(buy_price_str, buy_total_money_str, rise_rate) {
    let buy_price = new Decimal(buy_price_str)
    let buy_total_money = new Decimal(buy_total_money_str);
    let quantity = buy_total_money.div(buy_price);
    // let quantity = '5.7';
    let will_sell_price_str = buy_price.times(new Decimal(1).plus(rise_rate));
    let will_sell_price = new Decimal(will_sell_price_str)
    console.info("will_sell_price:",will_sell_price," buy_price:",buy_price)
    //售卖金额
    let will_sell_total_money = will_sell_price.times(quantity);
    //售卖佣金
    let will_sell_commission = will_sell_total_money.times(0.001);
    let profit = will_sell_total_money.times(1 - 0.001).minus(buy_total_money)
    let real_sell_total = will_sell_total_money.times(1 - 0.001);

    console.info("fast buy_total_money:", buy_total_money, " quantity:",quantity," real_sell_total:", real_sell_total, " profilt:", profit)
    console.info("fast will_sell_total_money:", will_sell_total_money, " will_sell_commission:", will_sell_commission)
}
let buy_fast_price = "0.0286";
let buy_fast_total_money = "8000";
let buy_fast_rise_rate = "0.01"
test_fast_get_profit(buy_fast_price,buy_fast_total_money,buy_fast_rise_rate);

function diff_order_profit() {

    // 比   let buy_total_money = buy_price.times(quantity); 要贵，因为需要付购买佣金，真正花费应该按订单里的总金额算

    let buy_total = "827.851992"
    let sell_price = '3034.66548';
    let quantity = "0.2785"
    let sell_total = new Decimal(sell_price).times(quantity);
    let profit = new Decimal(sell_total).times(1 - 0.001).minus(buy_total)
    console.info("diff_order_profit profit:", profit)
}

// diff_order_profit();

function rise_rate_and_reduce_rate() {
    // let current_price = new Decimal('3005.88')
    let current_price = new Decimal('2958.88')
    let max_price = new Decimal('3052.85')
    let low_price = new Decimal('2886.43')
    let rise_rate = (low_price.minus(current_price)).div(low_price)
    let positive_rise_rate = (current_price.minus(low_price)).div(low_price)

    let reduce_rate = (max_price.minus(current_price)).div(max_price)
    let negtive_reduce_rate = (current_price.minus(max_price)).div(max_price)
    console.info("rise_rate:", rise_rate, " positive_rise_rate:", positive_rise_rate)
    console.info("reduce_rate:", reduce_rate, " negtive_reduce_rate:", negtive_reduce_rate)
}

// rise_rate_and_reduce_rate()

function reduce_rate_and_shock_rate() {
    //跌
    // let start_price = new Decimal('2949.39')
    // let high_price = new Decimal('2949.40')
    // let close_price = new Decimal('2924.72')
    // let low_price = new Decimal('2924.03')

    //涨
    // let start_price = new Decimal('2922.77')
    // let high_price = new Decimal('2939.70')
    // let close_price = new Decimal('2935.6')
    // let low_price = new Decimal('2914.95')

    let start_price = new Decimal('2924.72')
    let high_price = new Decimal('2926.88')
    let close_price = new Decimal('2920.20')
    let low_price = new Decimal('2890.86')


    let reduce_rate = (start_price.minus(close_price)).div(start_price)
    let shock_rate = (high_price.minus(low_price)).div(low_price)

    console.info("reduce_rate:", reduce_rate);
    console.info("shock_rate:", shock_rate)

}
// reduce_rate_and_shock_rate();

// 578.56856 - 143.22
function test_self_profit() {
    let total = new Decimal('578.56856');
    let first = new Decimal("143.22")
    let other = total.minus(first)
    console.info("other:", other)
    let a = new Decimal('283.67');
    let b = new Decimal('36.33');
    let c = new Decimal('28.59');
    let d = new Decimal('87.19');

    let dd = a.plus(b).plus(c).plus(d)
    console.info("dd:", dd)
    let dd_value = dd.times(1 - 0.001)

    let kc = new Decimal('59.25').times(1 - 0.001)
    console.info("kc:", kc)
    console.info('dd_value:', dd_value)


    let bt = "BTCUSDT"
    console.info("bt:", bt.substring(0, 2))
    let et = "ETHUSDT"
    console.info("et:", et.substring(0, 2))
    let ap = "APEUSDT"
    console.info("ap:", ap.substring(0, 2))

}

let k_start_time = moment(1649493952154).format('YYYY-MM-DD HH:mm:ss');

console.info("k_start_time:",k_start_time)

function rise_reduce_rate() {
    let start_price = new Decimal('3436.75')
    let end_price = new Decimal('3451.37')
    let low_price = new Decimal("3426")
    let high_price = new Decimal('3455.38')
    let diff_end_start = end_price.minus(start_price)
    console.info("diff_end_start", diff_end_start)
    let rise_reduce_rate = diff_end_start.div(start_price)
    console.info("rise_reduce_rate:", rise_reduce_rate)

    let shock_diff = high_price.minus(low_price);
    let shock_rate = shock_diff.div(low_price);
    console.info("shock_rate:", shock_rate)

}

// rise_reduce_rate();

// let diff = 100
// let limit_size_need = Math.ceil(1/15)
// console.info("limit_size_need:",limit_size_need)

// let day = moment().subtract(7, 'days');
// console.info("day:",day)
// let format_str = 'YYYY-MM-DD HH:mm:ss'
// let before = moment().add(-7, 'days').format(format_str);
// console.info("before:",before)

function test_buy_quantity() {
    let origQty = '5.8'
    console.info("origQty:", origQty)
    //属于自己的coin数量，已经减去佣金
    let own_compute_commision = new Decimal(origQty).times(0.001)
    console.info("own_compute_commision:", own_compute_commision)
    let real_buy_quantity = new Decimal(origQty).minus(own_compute_commision);
    console.info("real_buy_quantity:", real_buy_quantity)
    let symbol = 'NEARUSDT'
    real_buy_quantity = buy_quantity_deal(real_buy_quantity, symbol)

    real_buy_quantity = real_buy_quantity.toString();
    console.info("real_buy_quantity:", real_buy_quantity)
}

function buy_quantity_deal(quantity, symbol) {

    if (symbol == 'OGNUSDT') {
        quantity = quantity.toFixed(0)
    } else if (symbol == 'APEUSDT') {
        quantity = quantity.toFixed(2)
    } else if (symbol == 'NEARUSDT') {
        quantity = quantity.toFixed(1)
    } else {
        //todo btcusdt quantity步长是5(真实购买的app是5)，非官网标注的是8。
        // todo btcusdt 步长是5位,ETH是4位
        quantity = quantity.toFixed(4)
    }
    return quantity
}

// test_buy_quantity();


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function test() {
    console.log('start test.');
    await sleep(3000);
    console.log('end test.');
}

//  test();
// console.log('continue execute！');