
const logger = require('log4js').getLogger("info");
let mail_service = require('../mail')
let user_dao = require('../dao/user_dao')
let user_reg_code_dao = require('../dao/user_reg_code_dao')
const moment = require('moment');

exports.register_send_verification_code = async (email) => {
    let user_db =  await user_dao.get_user(email)
    if(user_db.length > 0){
        throw new Error('403010');
    }
    let verification_code = Math.random().toString().slice(-6);
    let param = {email:email,verification_code:verification_code};
    let register_code = await user_reg_code_dao.list(email);
    // check code is expiration or no code,if true then continute proccess
    if(register_code.length > 0){
        let code_updatedAt = register_code[0].updatedAt;
        // 1 minute
        let duration = 1;
        let r = await exports.expiration_in_times(code_updatedAt,duration);
        if(!r){
            console.info("only send email in one minute, don't  repeat send email ")
            logger.info("only send email in one minute, don't repeat send email ")
            // 
            throw new Error('403017');
        }
    }
    await mail_service.sendEmailWithRegisterCode(param)
    await user_reg_code_dao.saveOrUpdate(email,verification_code)
    let result = {"status":"ok","code":200}
    return result
}

exports.check_verification_code = async(email,verification_code)=>{

   let list =  await user_reg_code_dao.list(email)
    if(list.length > 0){
        let code_updatedAt = list[0].updatedAt;
        // 1 hour
        let duration = 1*60;
        let result = exports.expiration_in_times(code_updatedAt,duration);
        if(!result){
            throw new Error('403018');
        }
        let code = list[0].code;

        if (code != verification_code) {
            throw new Error('403019');
        }else {
            return true
        }
       
    }else {
        throw new Error('403020');
    }

}



/**
 * 
 * @param {*} time 
 * @param {*} duration  unite is minute
 * @returns 
 */
exports.expiration_in_times = async (time,duration) => {

    let db_time = moment(time);
    console.info("db_time:",db_time.valueOf()," db_time:",db_time," moment():",moment())
    let total_duration = duration ;
    console.info("expiration_in_times time:",time," duration:",duration)
    let expiration_time = db_time.add(total_duration,'m').valueOf();
    let now = moment().valueOf();
    let flag = (now > expiration_time);
    console.info("expiration_in_times expiration_time:",expiration_time," now:",now," flag:",flag)
    if (flag) {
        return true;
    }
    return false;

}