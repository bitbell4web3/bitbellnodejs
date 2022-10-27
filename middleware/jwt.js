'use strict';

const jwt = require('jsonwebtoken');
const moment = require('moment');
const  userDao  = require('../dao/user_dao');
const logger = require('log4js').getLogger("info");
/**
 * jwt验证
 * @description 验证用户请求是否合法
 */
module.exports = async (ctx, next) => {
  const authorization = ctx.headers.authorization;
  const url = ctx.request.url;
  // console.info("authorization url:",url)
  let white_urls = ['/api/v1/user/login','/api/v1/admin/login','/api/v1/user/check_verification_code',
  '/api/v1/index','/api/v1/commonpass','/api/v1/user/send_email_with_reg_user'];
  for(let i = 0;i<white_urls.length;i++){
    let element = white_urls[i];
    if(url.indexOf(element) !== -1){
      return next();
    }
  }

  // console.info("authorization:",authorization)

  if (!authorization) {
    return ctx.error('401');
  }
  try {
    const token = authorization.slice(6);
    const decoded = jwt.decode(token);
    // { sub: 'test', created: 1564724940528, exp: 1565444940 }
    // logger.info('token解密内容：', decoded);
    if (!decoded.sub || !decoded.exp) {
      return ctx.error('401');
    }
    const currentTime = moment().unix();
    if (currentTime > +decoded.exp) {
      return ctx.error('401');
    }
    const data = await get_one_user_with_mail(decoded.sub);
    if (!data) {
      return ctx.error('401');
    }
    ctx.user = data;
    await next();
  } catch (err) {
    logger.error(err);
    return ctx.error('401');
  }
};

async function get_one_user_with_mail (phone) {
  const data = await userDao.get_one_user_with_mail(phone);
  return data;
}
