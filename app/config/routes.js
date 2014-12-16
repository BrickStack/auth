/**
 * Created by TDP on 12/14/2014.
 */
'use strict';
var passport = require('passport');

module.exports = function (app) {
    var users = require('../controllers/users');
    app.get('/', users.home);
    app.get('/home', users.home);

    //登陆页面
    app.get('/signin', users.signin);

    //注册页面
    app.get('/signup', users.signup);

    //超时
    app.get('/session_timeout', users.sessionTimeout);

    //注册创建一个账户
    app.post('/users', users.registerCheck, users.create);
    //邮件激活链接
    app.get('/users/activate_account', users.activateAccount);

    app.post('/users/session', passport.authenticate('local', {}), users.session);
};