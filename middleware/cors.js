'use strict';
const config = require('config');
const whitelist = config.whiteHost;

/**
 * 设置允许跨域白名单
 * @description 设置允许跨域白名单，白名单内容在配置文件中配置
 */
module.exports = async (ctx, next) => {
  ctx.set('Cache-Control', 'no-cache');
  ctx.set('X-Content-Make-Team', 'blackvip');
  let q = false;
  const url = ctx.headers['fastaitop.com'] || ctx.headers['host'] || 'localhost:4001';
  if (whitelist === '*') {
    q = true;
  } else {
    for (const i of whitelist) {
      if (url.indexOf(i) !== -1) {
        q = true;
        break;
      }
    }
  }
  if (!q) {
    console.info("cors error 2900015 ")
    return ctx.error('2900015');
  } else {
    ctx.set('Access-Control-Allow-Origin', "*");
    ctx.set('Access-Control-Allow-Headers', 'Engaged-Auth-Token, Access-Control-Allow-Headers, Access-Control-Allow-Origin, Cache-Control, Content-Type, Authorization, Content-Length, X-Requested-With, withCredentials');
    ctx.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    ctx.set('Access-Control-Allow-Credentials', 'true');
    ctx.set('Content-Type', 'application/json;charset=utf-8');
    if (ctx.method === 'OPTIONS') {
      console.info("cors OPTIONS ok ")
      return ctx.success('ok');
      // return next();
    }
    await next();
  }
};
