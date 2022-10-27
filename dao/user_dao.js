
const User = require('../models/index').User;

const logger = require('log4js').getLogger("info");


const enable_status = "1";
const disable_status = "2";

const admin_role = "2"
const normal_role = "1"

async function get_user(mail) {
    let condition = {};
        condition = {
            mail: mail
        }
    let list = await User.findAll({
        where: condition,
        attributes: ['id', 'phone', 'name', 'status','role_type','mail','description','is_del','password','createdAt','updatedAt']
    });
    return list;
}

async function get_one_user(phone) {
    let user = await User.findOne({
        where: {
            phone: phone
        },
        attributes: ['id', 'phone', 'name', 'status','role_type','password','mail','description','is_del','createdAt','updatedAt']
    });

    if (!user) {
        throw new Error('403011');
      }
    return user;
}


async function get_one_user_with_mail(mail) {
    let user = await User.findOne({
        where: {
            mail: mail
        },
        attributes: ['id', 'phone', 'name', 'status','role_type','password','mail','description','is_del','createdAt','updatedAt']
    });

    if (!user) {
        throw new Error('403011');
      }
    return user;
}


async function list() {
    let list = await User.findAll({
        attributes: ['id', 'phone', 'name', 'status','role_type','mail','description','is_del','createdAt','updatedAt']
    });
    return list;
}

async function getAdminInfo (phone) {
    const data = await User.findOne({
      where: { phone: phone, is_del: 0,role_type:admin_role },
      attributes: ['id', 'phone', 'name', 'status','role_type','mail','description','is_del','createdAt','updatedAt']
    });
    return data;
  }


async function create(mail,password,role_type) {
    const user = {
        mail:mail,
        password:password,
        role_type:role_type,
        status:enable_status,
        is_del:false
    };
    let result_set = await User.create(user);
    let result = {'id':result_set.id,'mail':result_set.mail}
    return result;
}

module.exports = {
    create,
    get_user,
    getAdminInfo,
    list,
    get_one_user,
    get_one_user_with_mail,
    normal_role,
    admin_role
}