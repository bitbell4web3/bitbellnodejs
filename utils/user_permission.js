'use strict';
const jwt = require('jsonwebtoken');
const userDao = require('../dao/user_dao')


function validate_admin_permission(ctx) {
  
  const authorization = ctx.headers.authorization;
  console.info("authorization:",authorization)
  if (!authorization) {
    return false;
  }
  try {
    const token = authorization.slice(6);
    const decoded = jwt.decode(token);
    let role = decoded.role
    console.info("robust role:",role)
    if (!role || role !== userDao.admin_role) {
      console.info("userDao.admin_role:",userDao.admin_role," role is not admin:",role," dbtype:",typeof(userDao.admin_role)," role:type:",typeof(role))
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}



exports.admin_permision_filter = async (ctx, urls) =>{
  let url = ctx.originalUrl
  try{
    console.info("url:",url," urls:",urls)
    if (urls.indexOf(url) > -1) {
      console.info("into validate")
      return validate_admin_permission(ctx);
    }else{
      console.info("admin_permision_filter=>normal role visit")
      return true;
    }
   
  }
  catch (err) {
    console.error("admin_permision_filter err====>:",err)
    return false
  }
 
}

