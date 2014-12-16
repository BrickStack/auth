/**
 * Created by TDP on 12/14/2014.
 */
'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

module.exports = function (app, passport) {
    //静态文件加载的路径，注意使用res.sendFile的情况，就需要在这里把路径加上
    app.use(express.static(path.resolve(__dirname, "../../")));
    app.use(express.static(path.resolve(__dirname, "../../src")));


    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(function (err, req, res, next) {
        if (~err.message.indexOf('not found')) {
            return next();
        }

        res.status(500).render('500', {
            error: err.stack
        });
    });
};