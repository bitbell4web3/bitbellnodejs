const nodemailer = require('nodemailer'); //发送邮件的node插件
const config = require('config');

let pass = '345234523452345'

//注册时发送邮件
function sendEmailWithRegisterCode(param) {

    let received_mail = param.email;

    // let received_mail = "27317142@qq.com"
    let verification_code = param.verification_code;
    console.info("received_mail:",received_mail,"verification_code:",verification_code);

    // let createTime = new Date();
    data = {
        email: received_mail,
        subject: " Create a Bitbell Account  ",
        content: `
        <p style="text-indent: 2em;">You are using BitBell to create a new account. The verification code is:</p>
        <p style="text-indent: 2em;"></p>
        <p style="text-indent: 2em;"></p>
        <p style="text-indent: 2em;">  ${ verification_code }</p>
        <p style="text-indent: 2em;"></p>
        <p style="text-indent: 2em;"></p>
        <p style="text-indent: 2em;"> The verification code will be invalid in 30 minutes. Do not disclose the 
        verification code  to others. And this is an automatic message,please do not reply. </p>
    `
    }

    
    let mailOptions = {
        from: '"product center " <admin@bitbell.xyz>',
        to: data.email,
        subject: data.subject,
        html: data.content
    };
    send_base_operate(mailOptions);

}

//发送邮件基本操作
function send_base_operate(mailOptions) {

    let transporter = nodemailer.createTransport({
        host:"smtpout.secureserver.net",
        port: 465,
        secureConnection: false,
        tls: {
            rejectUnauthorized: false
        },
        requireTLS:true,
        debug: true,
        auth: {
            user: "admin@bitbell.xyz",
            pass: "3453452345234523452345" 
        }
    });
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.info("error:",error)
            return console.log(error);
        }
        console.log('邮件发送成功 ID：', info.messageId);
    });

}


module.exports = {
    sendEmailWithRegisterCode,
}