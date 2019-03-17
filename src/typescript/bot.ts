import * as slackbot from 'slackbots';
import * as data from './data';
import * as request from 'request';
import * as gip from 'giphy-api';
import * as imageSearch from 'node-google-image-search';
import * as utils from './utils';
import * as haiku from 'haiku-random';

let giphy = gip();

class Bot {
    Name: string;
    params: data.params;
    botparams: data.botparam;
    slack: slackbot;
    user_name_id: data.userId;
    user_id_name: data.userName;
    constructor(name: string, botparm: data.botparam, parm: data.params) {
        this.Name = name;
        this.params = parm;
        this.botparams = botparm;
        this.slack = new slackbot(this.botparams);
        this.user_id_name = {};
        this.user_name_id = {};

        this.slack.on("start", () => {
            let users = this.slack.getUsers();
            users._value.members.forEach(user => {
                this.user_id_name[user.id] = user.name;
                this.user_name_id[user.name] = user.id;
            });
        });
        this.slack.on("message", (data : data.slackResponse) => {
            let type : string = data.type;
            let user : string = data.user;
            if (type === "message" && user !== this.user_name_id['stan']) {
                this.handleResponse(data.text, data.channel, user);
            }

        });
    }

    handleResponse(text: string, channel: string, user: string): void {
        try {
            if (text.includes(this.user_name_id['stan'])) {
                text = text.toLowerCase();
                console.log("Mentioned Stan \u{1F916}");
                if (utils.findGreeting(text)) { this.sendGreeting(channel); }
                if (utils.findRequest(text)) { 
                    if (text.includes("meme")) { this.sendMeme(text, channel, user); }
                    if (text.includes("gif")) { this.sendGif(text, channel, user); }
                    if (text.match(/nudes?/g)) { this.sendImage(user, channel); }
                    if (text.includes("poem")) { this.sendPoem(user, channel); }
                }
                if (text.includes("tell me a joke") || text.includes("tell a joke")) { this.tellJoke(user, channel); }
                if (text.includes("pick me up") || text.includes("pickup line")) { this.pickupLine(user, channel); }
                if (text.includes("what's the weather") || 
                    text.includes("what is the weather") ||
                    text.includes("how's the weather") ||
                    text.includes("how is the weather")) { this.getWeatherInfo(text, user, channel) }
                this.useCakeChat(text, channel);
            }
        } catch (err) {
            console.log('TypeError! \u{1F996}');
        }
    }

    sendGreeting(channel: string): void {
        let greet: string = data.responses.greeting[Math.floor(Math.random() * data.responses.greeting.length)];
        this.slack.postMessage(channel, greet, this.params);
    }

    sendMeme(text: string, channel: string, user: string): void {
        let cat: string = utils.getCategory(text);
        let args: Array<string> = [cat, process.env.MEME_API];
        let url: string = utils.Format(data.api.memeGenerator, args);
        request(url, { json: true }, (err, res, body) => {
            if (err) { return console.error(err); }
            try {
                let meme = body.result[Math.floor(Math.random() * body.result.length)].instanceImageUrl;
                this.postMsg(meme, channel, user);
            } catch (error) {
                this.slack.postMessage(channel, `Sorry <@${user}>! I can't find a meme with ${cat}`, this.params);
            }
        });
    }

    sendGif(text: string, channel: string, user: string): void {
        let cat: string = utils.getCategory(text);
        giphy.random({tag: cat, fmt: 'json'}, (err, res) => {
            if (err) { return console.error(err); }
            let gif = res.data.url;
            this.postMsg(gif, channel, user);
        });
    }

    sendImage(user: string, channel: string): void {
        let rnd: number = Math.floor(Math.random() * 99);
        imageSearch('female robots', (results) => {
            let img: string = results[0].link;
            this.postMsg(img, channel, user);
        }, rnd, 1);
    }

    sendPoem(user: string, channel: string): void {
        let poem: string = haiku.random("json").join('\n');
        this.postMsg(poem, channel, user);
    }

    tellJoke(user: string, channel: string): void {
        let joke: string = data.responses.jokes[Math.floor(Math.random() * data.responses.jokes.length)];
        this.postMsg(joke, channel, user);
    }

    pickupLine(user: string, channel: string): void {
        let pickup: string = data.responses.pickup[Math.floor(Math.random() * data.responses.pickup.length)];
        this.postMsg(pickup, channel, user);
    }

    getWeatherInfo(text: string, user: string, channel: string): void {
        // Extract the city name from text
        let city: string = utils.getCityName(text);
        console.log(city);
        // Create url for weathermap request
        let args: Array<string> = [city, process.env.WEATHER_MAP_API];
        let url: string = utils.Format(data.api.weatherMap, args);
        // Request weather data from weathermap
        request(url, { json: true }, (err, res, body) => {
            if (err) { console.error(err); }
            let weather = body;
            // Format mesage to post to slack
            let attr: string = `${weather.main.temp} C degrees and ${weather.weather[0].description}`;
            this.postMsg(attr, channel, user);
        });
    }

    useCakeChat(text: string, channel: string): void {
        let options: data.cakechat = {
            uri: 'http://localhost:8080/cakechat_api/v1/actions/get_response',
            method: 'POST',
            json: {
                context: [text],
                emotion: 'neutral'
            }
        };
        request(options, (err, res, body) => {
            if (err) { console.error(err); }
            console.log(body);
            this.slack.postMessage(channel, body.response, this.params);
        });
    }

    postMsg(attr: string, channel: string, user: string): void {
        let msg: string = data.messages.return[Math.floor(Math.random() * data.messages.return.length)];
        let emoji: string = data.messages.emojis[Math.floor(Math.random() * data.messages.emojis.length)];
        let args: Array<string> = [user, emoji, attr];
        msg = utils.Format(msg, args);
        this.slack.postMessage(channel, msg, this.params);
    }
}

export { Bot };