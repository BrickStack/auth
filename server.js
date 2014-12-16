/**
 * Created by TDP on 12/14/2014.
 */
'use strict';

var https = require("https");
var fs = require('fs');
var express = require("express");
var mongoose = require('mongoose');
var passport = require('passport');

//db settings
var db = mongoose.connect("mongodb://localhost:27019/test");
var models_path = __dirname + '/app/models';
var walk = function (path) {
    fs.readdirSync(path).forEach(function (file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);

//server settings
var app = express();
var server = require('http').createServer(app);

// Authenticate settings
require('./app/config/passport')(passport);
// Express settings
require('./app/config/express')(app, passport);
// Route settings
require('./app/config/routes')(app);
server.listen(7070);