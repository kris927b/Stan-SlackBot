let slackbot = require('slackbots');
let giphy = require('giphy-api')();
let request = require('request');
let express = require('express');
require('dotenv').config();
const path = require('path');
let imageSearch = require('node-google-image-search');
const responses = require('./data').responses;


let user_list = {};
const memeUrl  = 'http://version1.api.memegenerator.net//Instances_Search?q=';
const memeUrl1 = '&pageIndex=0&pageSize=12&apiKey=';
const memeAPI = process.env.MEME_API;
const PORT = process.env.PORT || 4550;
let app = express();

app.use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .listen(PORT, (err) => {
        if (err) { throw err; }
        console.log(`\n🚀  Stan LIVES on PORT ${PORT} 🚀`);
    });

let bot = new slackbot({
    token: process.env.SLACK_TOKEN,
    name: "Stan"
});

bot.on("start", () => {
    // bot.postMessageToChannel(channel, "Hello my dudes!! \u{1F916} \n"+
    //                                 "You can invoke me by mentioning me! If you say 'send meme' or 'send gif' + 'of/with (some category)' i will send you one!" + 
    //                                 "Example: '@Stan send a meme with cat'" +
    //                                 "You can also just greet me like so 'Hi @Stan'" + 
    //                                 "\u{1F680} \n" + 
    //                                 "So fire away \u{1F525}");
    //console.log("Hello my dudes!! \u{1F916}");
    let name = '';
    let id = 0;
    let users = bot.getUsers();
    for (user of users._value.members) {
        name = user.name;
        id = user.id;
        user_list[name] = id;
    }
});

bot.on("message", (data) => {
    switch(data.type) {
        case "message":
            if (data.user !== user_list['stan']) { 
                handleResponse(data);
            }
            break;
        default:
            return;
    }
});

function findWithOf(key) {
    return key === 'of' || key === 'with';
}

function findGreeting(text) {
    return text.includes("hi") || 
            text.includes("hello") || 
            text.includes("hey") ||
            text.includes("greetings");
}

function handleResponse(data) {
    if (data.text.includes(user_list["stan"])) {
        console.log("Mentioned Stan \u{1F916}");
        let text = data.text.toLowerCase();
        if (findGreeting(text)) {
            sendGreeting(data.channel);
        }
        if ((text.includes("send") && text.includes("a")) || text.includes("send a") || text.includes("send me")) {
            if (text.includes("gif")) { sendMessage(getGif, text, data.channel, data.user); }
            else if (text.includes("meme")) { sendMessage(getMeme, text, data.channel, data.user); }
            else if (text.match(/nudes?/g)) { getImage(data.user, 'female robots', data.channel); }
        }
        if (text.includes("thank you") || text.includes("thanks")) {
            if (text.includes("love") && text.includes("you")) {
                let msg = "You're welcome <@"+data.user+"> :stan: \u{1F64B} \n" +
                            "I love you too \u{1F498}";
                bot.postMessage(data.channel, msg);
            } else {
                let msg = "You're welcome <@"+data.user+"> :stan: \u{1F64B}";
                bot.postMessage(data.channel, msg);
            }
        }
    }
}

function sendGreeting(ch) {
    let greeting = getGreeting();
    bot.postMessage(ch, greeting);
}

function getGreeting() {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
}

function getGif(user, category, ch) {
    let msg = '';
    giphy.random({tag: category, fmt: 'json'}, function (err, res) {
        if (err) {
            console.error(err);
        }
        let gif = res.data.url;
        msg = "Here you go <@"+user+"> :robot_face: \n" + gif;
        bot.postMessage(ch, msg);
    });
}

function getMeme(user, category, ch) {
    let msg = '';
    request(memeUrl + category + memeUrl1 + memeAPI, { json: true }, (err, res, body) => {
        if (err) { return console.error(err); }
        let result = body.result;
        let meme = result[Math.floor(Math.random() * result.length)];
        let img = meme.instanceImageUrl;
        msg = "Here you go <@"+user+"> \u{1F4DD} \n" + img; 
        bot.postMessage(ch, msg);
    });
}

function getImage(user, category, ch) {
    let msg = '';
    let rnd = Math.floor(Math.random() * 99);
    imageSearch(category, (results) => {
        let img = results[0].link;
        msg = "Here you go <@"+user+"> \u{1F4DD} \n" + img; 
        bot.postMessage(ch, msg);
    }, rnd, 1);
}

function sendMessage(fn, text, channel, user) {
    let msg = '';
    console.log(msg);
    if (text.match(/with|of/g)) {
        let arr = text.split(" ");
        let index = arr.findIndex(findWithOf);
        fn(user, arr.slice(index+1).join(' '), channel);
    } else {
        fn(user, 'random', channel);
    }
}