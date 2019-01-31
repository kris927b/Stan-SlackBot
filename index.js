let slackbot = require('slackbots');
let giphy = require('giphy-api')();
let request = require('request');
let express = require('express');
require('dotenv').config();
const path = require('path');


let user_list = {};
const greetings = [
    "Hey dude! :stan:", 
    "What up! :stan:", 
    "What do you want? :pgsql:",
    "Hey man! :stan:",
    ":hd: :stan:",
    "Hi \u{1F916}"
];

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

function handleResponse(data) {
    if (data.text.includes(user_list["stan"])) {
        console.log("Mentioned Stan \u{1F916}");
        let text = data.text.toLowerCase();
        if (text.includes("hi") || text.includes("hello") || text.includes("hey")) {
            sendGreeting(data.channel);
        }
        if (text.includes("send a gif") || text.includes("send gif")) {
            sendMessage(getGif, text, data.channel, data.user);
        } else if (text.includes("send a meme") || text.includes("send meme")) {
            sendMessage(getMeme, text, data.channel, data.user);
        }
    }
}

function sendGreeting(ch) {
    let greeting = getGreeting();
    bot.postMessage(ch, greeting);
}

function getGreeting() {
    return greetings[Math.floor(Math.random() * greetings.length)];
}

function getGif(user, category) {
    giphy.random({tag: category, fmt: 'json'}, function (err, res) {
        if (err) {
            console.error(err);
        }
        let gif = res.data.url;
        let msg = "Here you go <@"+user+"> :robot_face: \n" + gif;
        return msg;
    });
}

function getMeme(user, category) {
    request(memeUrl + category + memeUrl1 + memeAPI, { json: true }, (err, res, body) => {
        if (err) { return console.error(err); }
        let result = body.result;
        let meme = result[Math.floor(Math.random() * result.length)];
        let img = meme.instanceImageUrl;
        let msg = "Here you go <@"+user+"> \u{1F4DD} \n" + img;
        return msg; 
    });
}

function sendMessage(fn, text, channel, user) {
    if (text.includes("of") || text.includes("with")) {
        let arr = text.split(" ");
        let index = arr.findIndex(findWithOf);
        let msg = fn(user, arr[index+1]);
    } else {
        let msg = fn(user, 'random');
    }
    bot.postMessage(channel, msg);
}