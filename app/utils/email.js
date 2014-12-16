/**
 * Created by TDP on 12/12/2014.
 */
var nodemailer = require('nodemailer');

var smtpConfig = {
    host: "smtpscn.huawei.com",
    port: 25,
    domains: 'huawei.com',
    authUser: "pmail_hpaas",
    authPassword: "hang.001",
    from: "paas-support@huawei.com"
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