'use strict';
const Router = require('koa-router');
const router = new Router({
  prefix: '/api/v1'
});
require('./routers/user_router')(router)
require('./routers/spot_symbol_price_router')(router)

module.exports = router;

