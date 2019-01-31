let slackbot = require('slackbots');
let giphy = require('giphy-api')();
let request = require('request');
let express = require('express');

const channel = "random";
let user_list = {};
const greetings = [
    "Hey dude! :stan:", 
    "What up! :stan:", 
    "What do you want? :pgsql:",
    "Hey man! :stan:",
    ":hd: :stan:",
    "Hi \u{1F916}"
];
const memeUrl = 'http://version1.api.memegenerator.net//Instances_Search?q=random&pageIndex=0&pageSize=12&apiKey=';
const memeAPI = '1272a57c-be22-4091-b0f5-f01cd30143d3';
const PORT = process.env.PORT || 4550;
let app = express();

app.listen(PORT, (err) => {
    if (err) { throw err; }
    console.log(`\n🚀  Starbot LIVES on PORT ${PORT} 🚀`);
});


let bot = new slackbot({
    token: "xoxb-477272901538-536141309570-8GjXF7ukRQHusPlanVJZoIjG",
    name: "Stan"
});

bot.on("start", () => {
    bot.postMessageToChannel(channel, "Hello my dudes!! \u{1F916} \n"+
                                    "You can invoke me by mentioning me! If you say 'send meme' or 'send gif' + 'of/with (some category)' i will send you one!" + 
                                    "Example: '@Stan send a meme with cat'" +
                                    "You can also just greet me like so 'Hi @Stan'" + 
                                    "\u{1F680} \n" + 
                                    "So fire away \u{1F525}");
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

function findOf(key) {
    return key === 'of';
}

function findWith(key) {
    return key === 'with';
}

function handleResponse(data) {
    if (data.text.includes(user_list["stan"])) {
        console.log("Mentioned Stan \u{1F916}");
        let text = data.text.toLowerCase();
        if (text.includes("hi") || text.includes("hello") || text.includes("hey")) {
            sendGreeting();
        }
        if (text.includes("send a gif") || text.includes("send gif")) {
            if (text.includes("of")) {
                let arr = text.split(" ");
                let index = arr.findIndex(findOf);
                sendGif(data.user, arr[index+1]);
            } else if (text.includes("with")) {
                let arr = text.split(" ");
                let index = arr.findIndex(findWith);
                sendGif(data.user);
            } else {
                sendGif(data.user, 'random');
            }
        }
        if (text.includes("send a meme") || text.includes("send meme")) {
            sendMeme(data.user);
        }
    }
}

function sendGreeting() {
    let greeting = getGreeting();
    bot.postMessageToChannel(channel, greeting);
}

function getGreeting() {
    return greetings[Math.floor(Math.random() * greetings.length)];
}

function sendGif(user, category) {
    giphy.random({tag: category, fmt: 'json'}, function (err, res) {
        if (err) {
            console.error(err);
        }
        let gif = res.data.url;
        let msg = "Here you go <@"+user+"> :robot_face: \n" + gif;
        bot.postMessageToChannel(channel, msg);
    });
}

function sendMeme(user) {
    request(memeUrl + memeAPI, { json: true }, (err, res, body) => {
        if (err) { return console.error(err); }
        let result = body.result;
        let meme = result[Math.floor(Math.random() * result.length)];
        let img = meme.instanceImageUrl;
        let msg = "Here you go <@"+user+"> \u{1F4DD} \n" + img;
        bot.postMessageToChannel(channel, msg); 
    });
}