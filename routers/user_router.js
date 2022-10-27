let user_controller = require('../controller/user_controller')
module.exports = (router => {
  router.post('/user/create', user_controller.create) 
  router.post('/user/login', user_controller.login) 
  router.post('/user/send_email_with_reg_user', user_controller.send_email_with_register_user)
  router.post('/user/check_verification_code', user_controller.check_verification_code)
})



