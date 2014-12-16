var url = require("url");
var crypto = require("crypto");
var Guid = require('guid');
var async = require('async');
var path = require('path');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Email = require('../utils/email');

/**
 * Show home pages
 */
exports.home = function (req, res) {
    //signin.html
    res.set({
        'Content-Type': 'text/html'
    });
    var sigupFile = path.resolve(__dirname, "../../src/home.html");
    res.sendFile(sigupFile);
};
/**
 * Show login form
 */
exports.signin = function (req, res) {
    //signin.html
    res.set({
        'Content-Type': 'text/html'
    });
    var sigupFile = path.resolve(__dirname, "../../src/signin.html");
    res.sendFile(sigupFile);
};

/**
 * Show sign up form
 */
exports.signup = function (req, res, next) {
    //signup.html
    res.set({
        'Content-Type': 'text/html'
    });
    var sigupFile = path.resolve(__dirname, "../../src/signup.html");
    res.sendFile(sigupFile);
};

/**
 * Logout
 */
exports.signout = function (req, res) {
    res.redirect('/');
};
/**
 * 检查用户Session是否超时
 */
exports.sessionTimeout = function (req, res, next) {

};

exports.create = function (req, res, next) {
    var message = "";
    var user = new User(req.body);
    user.guid = Guid.raw();
    user.actived = false;
    user.activate_key = crypto.randomBytes(32).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    user.save(function (err) {
        if (err) {
            switch (err.code) {
                case 11000:
                case 11001:
                    message = '该邮箱已被占用，请使用其它邮箱';
                    break;
                default:
                    message = '糟糕，服务器开小差去了';
            }
            return res.status(500).send({message: message});
        }
        sendActivateMail(req, res, user);
        return res.status(200).send("注册成功");
    });
};
var sendActivateMail = function (req, res, user) {
    var email = user.email;
    var username = user.username;
    var subject = '华为公有云平台帐号激活';
    var baseURI = url.format({
        protocol: req.protocol,
        hostname: req.hostname,
        port: 7070
    });
    var html = '<p>您好：<p/>' +
        '<p>我们收到您在华为公有云平台的注册信息，请点击下面的链接来激活帐户：</p>' +
        '<a href="' + baseURI + '/users/activate_account?username=' + username + '&key=' + user.activate_key + '">激活链接</a>' +
        '<p>若您没有在华为公有云平台填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
        '<p>华为公有云平台 谨上。</p>';

    Email.sendEmail(email, subject, html, function (err, res) {
        if (err) {
            console.log(err);
        }
    });
};

exports.activateAccount = function (req, res, next) {
    var username = req.param('username');
    var activate_key = req.param('key');
    User.findOne({"username": username}, function (err, user) {
        if (err) {
            console.dir(err);
            res.status(500).send("激活失败，请联系系统管理员！");
            return;
        }
        if (user == null) {
            res.status(404).send("账户不存在！");
            return;
        }

        if (typeof(user.activate_key) == 'undefined') {
            user.actived = true;
        } else {
            if (activate_key == user.activate_key) {
                user.actived = true;
                user.activate_key = undefined;
            } else {
                res.status(400).send("激活失败，链接已失效！");
                return;
            }
        }
        user.save(function (err) {
            if (err) {
                res.status(500).send("激活失败，请联系系统管理员！");
            } else {
                res.status(200).send('激活成功');
            }
        });
    });
};

//注册时参数检查
exports.registerCheck = function (req, res, next) {
    var cloud_user = req.body;
    //邮箱验证函数
    var emailRe = /^([a-zA-Z0-9]+[_|\_|\.\-]?)*[a-zA-Z0-9]+@\w+\.\w+$/;
    if (!emailRe.test(cloud_user.email)
        || (cloud_user.email == "" || cloud_user.password == "")
        || (cloud_user.password !== cloud_user.password2)) {
        console.dir(cloud_user);
        res.status(400);
        res.end('400');
        return res;
    }

    //必须是用户名和邮件同时不被占用才校验通过
    async.parallel([
        function (callback) {
            User.find({username: cloud_user.username}, function (err, users) {
                if (users.length > 0) {
                    callback(null, false);
                } else {
                    callback(null, true);
                }
            });
        },
        function (callback) {
            User.find({email: cloud_user.email}, function (err, users) {
                if (users.length > 0) {
                    callback(null, false);
                } else {
                    callback(null, true);
                }
            });
        }
    ], function (err, results) {
        if (results.join(",") == "true,true") {
            next();
        }
        else {
            return res.status(409).send("信息已经注册").end("409");
        }
    });
};

/**
 * Session
 */
exports.session = function (req, res) {
    var user = req.user;

    async.waterfall([
        function (cb) {
            if ((typeof(user.actived) != 'undefined') && (user.actived == false)) {
                return cb("NOT_ACTIVATED");
            }
            cb(null, {});
        },
        function (result, cb) {
            //TODO: 登录SC
            cb(null, {})
        }
    ], function (err, result) {
        if (err) {
            if (err == "NOT_ACTIVATED") {
                return res.status(409).send({error: "NOT_ACTIVATED"});
            } else {
                res.status(401);
                res.end('401');
                return res;
            }
        }

        res.status(200);
        res.end('200');
        return res;
    });
};