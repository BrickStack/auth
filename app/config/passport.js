/**
 * Created by TDP on 12/14/2014.
 */
'use strict';

var mongoose = require('mongoose')
    , User = mongoose.model('User');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.guid);
    });

    passport.deserializeUser(function (guid, done) {
        User.findById({
            "guid": guid
        }, function (err, user) {
            done(err, user);
        });
    });
    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },
        function (username, password, done) {
            console.log(username, password);
            var options = {
                username: username
            };
            //如果是邮箱格式的，需要采用邮箱搜索
            var emailRe = /^([a-zA-Z0-9]+[_|\_|\.\-]?)*[a-zA-Z0-9]+@\w+\.\w+$/;
            if (emailRe.test(username)) {
                options = {
                    email: username
                }
            }
            User.findOne(options, function (err, user) {
                if (err) {
                    return done(err);
                }
                console.log(user);
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (!user.authenticate(password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        }
    ));
};



