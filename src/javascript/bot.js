"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var slackbot = require("slackbots");
var data = require("./data");
var request = require("request");
var gip = require("giphy-api");
var imageSearch = require("node-google-image-search");
var utils = require("./utils");
var haiku = require("haiku-random");
var giphy = gip();
var Bot = /** @class */ (function () {
    function Bot(name, botparm, parm) {
        var _this = this;
        this.Name = name;
        this.params = parm;
        this.botparams = botparm;
        this.slack = new slackbot(this.botparams);
        this.user_id_name = {};
        this.user_name_id = {};
        this.slack.on("start", function () {
            var users = _this.slack.getUsers();
            users._value.members.forEach(function (user) {
                _this.user_id_name[user.id] = user.name;
                _this.user_name_id[user.name] = user.id;
            });
        });
        this.slack.on("message", function (data) {
            var type = data.type;
            var user = data.user;
            if (type === "message" && user !== _this.user_name_id['stan']) {
                _this.handleResponse(data.text, data.channel, user);
            }
        });
    }
    Bot.prototype.handleResponse = function (text, channel, user) {
        try {
            if (text.includes(this.user_name_id['stan'])) {
                text = text.toLowerCase();
                console.log("Mentioned Stan \uD83E\uDD16");
                if (this.findGreeting(text)) {
                    this.sendGreeting(channel);
                }
                if (this.findRequest(text)) {
                    if (text.includes("meme")) {
                        this.sendMeme(text, channel, user);
                    }
                    if (text.includes("gif")) {
                        this.sendGif(text, channel, user);
                    }
                    if (text.match(/nudes?/g)) {
                        this.sendImage(user, channel);
                    }
                    if (text.includes("poem")) {
                        this.sendPoem(user, channel);
                    }
                }
                if (text.includes("tell me a joke") || text.includes("tell a joke")) {
                    this.tellJoke(user, channel);
                }
                if (text.includes("pick me up") || text.includes("pickup line")) {
                    this.pickupLine(user, channel);
                }
                if (text.includes("what's the weather") ||
                    text.includes("what is the weather") ||
                    text.includes("how's the weather") ||
                    text.includes("how is the weather")) {
                    this.getWeatherInfo(text, user, channel);
                }
            }
        }
        catch (err) {
            console.log("TypeError! \uD83E\uDD96");
        }
    };
    Bot.prototype.findGreeting = function (text) {
        var greeting = false;
        data.messages.greeting.forEach(function (greet) {
            if (text.includes(greet)) {
                greeting = true;
            }
        });
        return greeting;
    };
    Bot.prototype.findRequest = function (text) {
        if ((text.includes("send") && text.includes("a")) ||
            text.includes("send a") || text.includes("send me")) {
            return true;
        }
        return false;
    };
    Bot.prototype.getCategory = function (text) {
        if (text.match(/with|of/g)) {
            var arr = text.split(" ");
            var index = arr.findIndex(function (key) {
                return key === 'of' || key === 'with';
            });
            return arr.slice(index + 1).join(' ');
        }
        else {
            return 'random';
        }
    };
    Bot.prototype.sendGreeting = function (channel) {
        var greet = data.responses.greeting[Math.floor(Math.random() * data.responses.greeting.length)];
        this.slack.postMessage(channel, greet, this.params);
    };
    Bot.prototype.sendMeme = function (text, channel, user) {
        var _this = this;
        var cat = this.getCategory(text);
        var args = [cat, process.env.MEME_API];
        var url = utils.Format(data.api.memeGenerator, args);
        request(url, { json: true }, function (err, res, body) {
            if (err) {
                return console.error(err);
            }
            var meme = body.result[Math.floor(Math.random() * body.result.length)].instanceImageUrl;
            _this.postMsg(meme, channel, user);
        });
    };
    Bot.prototype.sendGif = function (text, channel, user) {
        var _this = this;
        var cat = this.getCategory(text);
        giphy.random({ tag: cat, fmt: 'json' }, function (err, res) {
            if (err) {
                return console.error(err);
            }
            var gif = res.data.url;
            _this.postMsg(gif, channel, user);
        });
    };
    Bot.prototype.sendImage = function (user, channel) {
        var _this = this;
        var rnd = Math.floor(Math.random() * 99);
        imageSearch('female robots', function (results) {
            var img = results[0].link;
            _this.postMsg(img, channel, user);
        }, rnd, 1);
    };
    Bot.prototype.sendPoem = function (user, channel) {
        var poem = haiku.random("json").join('\n');
        this.postMsg(poem, channel, user);
    };
    Bot.prototype.tellJoke = function (user, channel) {
        var joke = data.responses.jokes[Math.floor(Math.random() * data.responses.jokes.length)];
        this.postMsg(joke, channel, user);
    };
    Bot.prototype.pickupLine = function (user, channel) {
        var pickup = data.responses.pickup[Math.floor(Math.random() * data.responses.pickup.length)];
        this.postMsg(pickup, channel, user);
    };
    Bot.prototype.getWeatherInfo = function (text, user, channel) {
        var _this = this;
        // Extract the city name from text
        var city = utils.getCityName(text);
        console.log(city);
        // Create url for weathermap request
        var args = [city, process.env.WEATHER_MAP_API];
        var url = utils.Format(data.api.weatherMap, args);
        // Request weather data from weathermap
        request(url, { json: true }, function (err, res, body) {
            if (err) {
                console.error(err);
            }
            var weather = body;
            // Format mesage to post to slack
            var attr = weather.main.temp + " C degrees and " + weather.weather[0].description;
            _this.postMsg(attr, channel, user);
        });
    };
    Bot.prototype.postMsg = function (attr, channel, user) {
        var msg = data.messages.return[Math.floor(Math.random() * data.messages.return.length)];
        var emoji = data.messages.emojis[Math.floor(Math.random() * data.messages.emojis.length)];
        var args = [user, emoji, attr];
        msg = utils.Format(msg, args);
        this.slack.postMessage(channel, msg, this.params);
    };
    return Bot;
}());
exports.Bot = Bot;
