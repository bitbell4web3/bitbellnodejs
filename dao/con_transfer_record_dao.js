
const ConTransferRecord = require('../models/index').ConTransferRecord;

const logger = require('log4js').getLogger("info");


async function create(discord_account,transfer_amount,user_id,desc) {
    const model = {
        discord_account:discord_account,
        transfer_amount:transfer_amount,
        operator_user_id:user_id,
        desc:desc,
        is_del:false
    };
    let result = await ConTransferRecord.create(model);
    return result;
}

module.exports = {
    create,
}