"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var bot_1 = require("./bot");
dotenv.config();
var app = express();
app.use(express.static(path.join(__dirname, 'public')), favicon(path.join('./views', 'favicon', 'favicon.ico')))
    .set('views', path.join('./', 'views'))
    .set('view engine', 'ejs')
    .get('/', function (req, res) { return res.render('pages/index'); })
    .listen(process.env.PORT, function (err) {
    if (err) {
        throw err;
    }
    console.log("\n\uD83D\uDE80  Stan LIVES on PORT " + process.env.PORT + " \uD83D\uDE80");
});
var params = {
    slackbot: true,
    icon_emoji: ':stan:'
};
var slackparams = {
    token: process.env.SLACK_TOKEN,
    name: "Stan"
};
var stan = new bot_1.Bot("Stan", slackparams, params);
