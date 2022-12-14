'use strict';

const logger = require('log4js').getLogger("param");
const langs = {
  'en-us': require('../i18n/en-US.json'),
  'zh-cn': require('../i18n/zh-CN.json')
};
/**
 * 处理响应数据
 */
module.exports = async (ctx, next) => {
  ctx.success = (data, status = 200) => {
    ctx.body = { code: 200, data, message: '操作成功', success: true };
    ctx.status = status;
  };
  ctx.error = (err, status, data) => {
    const r = parseError(ctx, err, status, data);
    ctx.body = r.body;
    ctx.status = r.status;
  };

  try {
    await next();
    const status = ctx.status;
    if (status === 404) {
      ctx.error('400404');
    }
  } catch (err) {
    ctx.error(err);
  }
};

/**
 * @description 解析错误信息
 * @param {object} ctx
 * @param {any} err 错误信息
 * @param {number} status 自定义状态码
 * @param {object} data 自定义错误信息
 */
function parseError (ctx, err, status, data) {
  let lang = ctx.acceptsLanguages('en-US', 'zh-CN');
  lang = (lang && typeof lang !== 'undefined') ? (lang && lang.toLowerCase()) : 'zh-cn';
  lang = lang.indexOf(',') !== -1 ? lang.substr(0, 5) : lang;
  ctx.lang = lang;
  const i18n = langs[lang] ? langs[lang] : langs['zh-cn'];
  ctx.i18n = i18n;
  if (typeof err === 'string' && Number.isInteger(+err)) {
    const e = i18n[err];
    if (!e) {
      return {
        status: status || 400,
        body: Object.assign({ code: '400400', message: err }, data)
      };
    }
    return {
      status: status || e.status || 400,
      body: Object.assign({ code: err, message: e.message }, data)
    };
  } else if (typeof err === 'object') {
    if (typeof err.message === 'string' && Number.isInteger(+err.message)) {
      const e = i18n[err.message];
      if (e) {
        return {
          status: status || e.status || 400,
          body: Object.assign({ code: err.message, message: e.message }, data)
        };
      }
    } else if (typeof err.message === 'string' && err.message.indexOf('Error') > -1) {
      const e = i18n[err.message.slice(7)];
      if (e) {
        return {
          status: status || e.status || 400,
          body: Object.assign({ code: err.message.slice(7), message: e.message }, data)
        };
      }
    }
    handlerError(ctx, err);
    return {
      status: status || 500,
      body: Object.assign({ code: '400500', message: err.message }, data)
    };
  } else {
    handlerError(ctx, err);
    return {
      status: status || 500,
      body: Object.assign({ code: '400500', message: err.message }, data)
    };
  }
}

/**
 * @description 打印错误日志，并发送邮件和钉钉提示
 * @param {object} ctx
 * @param {object} err 错误信息
 */
function handlerError (ctx, err) {
  const ip = ctx.headers['x-real-ip'] || ctx.headers['x-forward-for'] || ctx.ip;
  logger.error('Error Begin ====>');
  logger.error('请求信息 -- 状态码：', ctx.status, ip, '---', ctx.method, ctx.request.href, '---', ctx.headers['user-agent'], '---- Token: ', ctx.headers['authorization']);
  logger.error('请求体：', ctx.query, ctx.request.body);
  logger.error('错误信息', err);
  logger.error('<===== Error End');
}
