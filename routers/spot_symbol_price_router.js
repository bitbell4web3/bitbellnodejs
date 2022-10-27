let spot_symbol_price_controller = require('../controller/spot_symbol_price_controller');
module.exports = (router => {
  router.post('/spot/list', spot_symbol_price_controller.list) 
  router.post('/spot/create', spot_symbol_price_controller.create) 
  
})



