
const UserRegCode = require('../models/index').UserRegCode;

const logger = require('log4js').getLogger("info");


async function saveOrUpdate(email,code) {

    let record = await list(email);

    if(record.length > 0){
        let result = await UserRegCode.update({
            code:code
        },{
            where:{
                email:email
            }
        });
        return result;

    }else{
        const model = {
            email:email,
            code:code,
            is_del:false
        };
        let result = await UserRegCode.create(model);
        return result;
    }
}

async function list(email) {
    let condition = {};
        condition = {
            email: email
        }
    let list = await UserRegCode.findAll({
        where: condition
    });
    return list;
}

module.exports = {
    saveOrUpdate,
    list
}