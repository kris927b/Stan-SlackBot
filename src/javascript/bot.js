"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var slackbot = require("slackbots");
var data_1 = require("./data");
var request = require("request");
var gip = require("giphy-api");
var imageSearch = require("node-google-image-search");
var utils_1 = require("./utils");
var haiku = require("haiku-random");
var giphy = gip();
var Bot = /** @class */ (function () {
    function Bot(name, botparm, parm) {
        var _this = this;
        this.Name = name;
        this.params = parm;
        this.botparams = botparm;
        this.slack = new slackbot(this.botparams);
        this.api = "http://version1.api.memegenerator.net//Instances_Search?q={0}&pageIndex=0&pageSize=12&apiKey={1}";
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
            }
        }
        catch (err) {
            console.log("TypeError! \uD83E\uDD96");
        }
    };
    Bot.prototype.findGreeting = function (text) {
        var greeting = false;
        data_1.messages.greeting.forEach(function (greet) {
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
    Bot.prototype.findWithOf = function (key) {
        return key === 'of' || key === 'with';
    };
    Bot.prototype.getCategory = function (text) {
        if (text.match(/with|of/g)) {
            var arr = text.split(" ");
            var index = arr.findIndex(this.findWithOf);
            return arr.slice(index + 1).join(' ');
        }
        else {
            return 'random';
        }
    };
    Bot.prototype.sendGreeting = function (channel) {
        var greet = data_1.responses.greeting[Math.floor(Math.random() * data_1.responses.greeting.length)];
        this.slack.postMessage(channel, greet, this.params);
    };
    Bot.prototype.sendMeme = function (text, channel, user) {
        var _this = this;
        var cat = this.getCategory(text);
        var args = [cat, process.env.MEME_API];
        var url = utils_1.Format(this.api, args);
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
        var joke = data_1.responses.jokes[Math.floor(Math.random() * data_1.responses.jokes.length)];
        this.postMsg(joke, channel, user);
    };
    Bot.prototype.pickupLine = function (user, channel) {
        var pickup = data_1.responses.pickup[Math.floor(Math.random() * data_1.responses.pickup.length)];
        this.postMsg(pickup, channel, user);
    };
    Bot.prototype.postMsg = function (attr, channel, user) {
        var msg = data_1.messages.return[Math.floor(Math.random() * data_1.messages.return.length)];
        var emoji = data_1.messages.emojis[Math.floor(Math.random() * data_1.messages.emojis.length)];
        var args = [user, emoji, attr];
        msg = utils_1.Format(msg, args);
        this.slack.postMessage(channel, msg, this.params);
    };
    return Bot;
}());
exports.Bot = Bot;
