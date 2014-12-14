/**
 * Created by TDP on 12/14/2014.
 */
var https = request("https");
var express = request("express");
var app = new express();

app.get("/signup", function(req, resp, callback) {
    req.getParameter('')
    console.log("enter app /");
});

app.listen(8080, function() {
    console.log("server start");
});