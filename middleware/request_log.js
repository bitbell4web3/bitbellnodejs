'use strict';

/**
 * 打印接口访问日志
 * @description 打印接口访问日志，主要包括客户端ip，token，访问时间等
 */
const logger = require('log4js').getLogger("param");
module.exports = async (ctx, next) => {
  const t = new Date();
  const start = t.getTime();
  const ip = ctx.headers['x-real-ip'] || ctx.headers['x-forward-for'] || ctx.ip;
  // logger.info('Started ===> ', ip, '---', ctx.method, ctx.request.href, '---', ctx.headers['user-agent'], '---- Token:>>>>>', ctx.headers['authorization']);
  // logger.info('>>>>>>>>>>>>>>请求体开始<<<<<<<<<<<<<<<<');
  // logger.info('query>>>>>>:', ctx.query);
  // logger.info('body>>>>>>:', ctx.request.body);
  // logger.info('>>>>>>>>>>>>>>请求体结束<<<<<<<<<<<<<<<<');
  await next();
  const duration = ((new Date().getTime()) - start);
  // logger.info('>>>>>>>>>>>>>>响应体开始<<<<<<<<<<<<<<<<');
  // logger.info(ctx.body);
  // logger.info('>>>>>>>>>>>>>>响应体结束<<<<<<<<<<<<<<<<');
  ctx.set('X-Response-Time', duration + 'ms');
  // logger.info('Completed ===> ', ctx.status, '(' + duration + 'ms)');
};
