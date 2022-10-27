'use strict';

const config = require('config');
const jwt = require('jsonwebtoken');

/**
 * 生产token
 * @param {string} username 用户名
 */
exports.generateToken = async (username,role) => {
  const secret = config.get('jwt').secret;
  const expiration = config.get('jwt').expiration;
  const tokenHead = config.get('jwt').tokenHead;
  // 创建时间
  const created = new Date().getTime();
  // 生成token
  const token = jwt.sign({
    sub: username,
    role:role,
    created
  }, Buffer.from(secret, 'base64'), {
    algorithm: 'HS512',
    expiresIn: expiration
  });
  return { token, tokenHead };
};


