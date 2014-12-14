/**
 * Created by TDP on 12/12/2014.
 */
var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'tsgscd@gmail.com',
        pass: 'xszheyegcbckjukb'
    }
});
var mailOptions = {
    from: 'Steve', // sender address
    to: '260285928@qq.com', // list of receivers
    subject: 'test smtp', // Subject line
    text: 'Hello world ✔', // plaintext body
    html: '<b>Hello world ✔</b>' // html body
};
module.exports.sendEmail = function () {
    smtpTransport.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("error = ", error);
        }
        else {
            console.log("send message, info=", info);
        }
    });
};