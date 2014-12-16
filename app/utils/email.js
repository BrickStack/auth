/**
 * Created by TDP on 12/12/2014.
 */
var nodemailer = require('nodemailer');

var smtpConfig = {
    host: "xxx",
    port: 25,
    domains: 'xxx',
    authUser: "xxx",
    authPassword: "xxx",
    from: "xxx"
};

var smtpTransport = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    domains: smtpConfig.domains,
    auth: {
        user: smtpConfig.authUser,
        pass: smtpConfig.authPassword
    },
    "authMethod": "LOGIN",
    "ignoreTLS": true
});

module.exports.sendEmail = function (receivers, subject, content, errCallback, successCallback) {
    var options = {
        from: smtpConfig.from,
        to: receivers,
        subject: subject,
        html: content
    };
    smtpTransport.sendMail(options, function (error, info) {
        if (error) {
            errCallback && errCallback(error, response);
        } else {
            successCallback && successCallback(response);
        }
    });
};