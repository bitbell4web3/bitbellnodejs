const userDao = require('../dao/user_dao')
const logger = require('log4js').getLogger("info");
const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt')
const mail = require('../mail/index')
const user_register_service = require('../service/user_register_service')
exports.create = async ctx => {
  try {
    const validator = ctx.validator;
    const data = ctx.request.body;
    logger.info("user create data=====>:", data)
    let email = data.email
    let password = data.password
    // normal user
    let role_type = "1"
    validator.check(password).notEmpty();
    validator.check(email).notEmpty();
    let exists_list = await userDao.get_user(email);
    console.log("exists_list:",exists_list)
    if (exists_list.length > 0) {
      return ctx.error("403010");
    }
    logger.info("exists_list:", exists_list)
    const salt = bcrypt.genSaltSync(10, 'a');
    let hash_password = bcrypt.hashSync(password, salt);
    let result = await userDao.create(email, hash_password, role_type)
    ctx.success(result);
  } catch (err) {
    logger.error("err=========>:", err)
    ctx.error(err);
  }
};


exports.index = async ctx => {
  try {
    const data = ctx.request.query;
    logger.info("index data:", data);
    const r = {
      "status": "ok"
    }
    ctx.success(r);
  } catch (err) {
    ctx.error(err);
    logger.error("err:", err)
  }
};
/**
 * 用户登录
 * @param {*} ctx 
 */
exports.login = async ctx => {
  try {
    const validator = ctx.validator;
    const data = ctx.request.body;
    logger.info("user login data=====>:", data)
    let email = data.email
    let password = data.password
    validator.check(password).notEmpty();
    validator.check(email).notEmpty();
    let user = await userDao.get_one_user_with_mail(email);
    let db_password = user.password;
    logger.info("db_password:",db_password,"password:",password)
    let role_tye = user.role_type;
    const r = bcrypt.compareSync(password, db_password);
    if(!r){
      logger.error("user login data===== err>:", r)
      throw new Error("403012")
    }
    const token = await jwt.generateToken(email,role_tye);
    console.log("token:",token)
    ctx.success(token);
  } catch (err) {
    ctx.error(err);
    logger.error("err:", err)
  }
};

exports.list = async ctx => {
  try {
    const list = await userDao.list()
    ctx.success(list);
  } catch (err) {
    ctx.error(err);
    logger.error("err:", err)
  }
};

exports.send_email_with_register_user = async ctx => {
  try {
    const validator = ctx.validator;
    const data = ctx.request.body;
    let email = data.email
    validator.check(email).notEmpty();
    const result = await user_register_service.register_send_verification_code(email)
    ctx.success(result);
  } catch (err) {
    ctx.error(err);
    logger.error("err:", err)
  }
};

exports.check_verification_code = async ctx => {
  try {
    const validator = ctx.validator;
    const data = ctx.request.body;
    let verification_code = data.verification_code;
    let email = data.email
    validator.check(email).notEmpty();
    validator.check(verification_code).notEmpty();
    const result = await user_register_service.check_verification_code(email,verification_code)
    ctx.success(result);
  } catch (err) {
    ctx.error(err);
    logger.error("err:", err)
  }
};