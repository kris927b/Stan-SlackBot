import * as slackbot from 'slackbots';
import { params, botparam, userId, userName, slackResponse, responses, messages } from './data';
import * as request from 'request';
import * as gip from 'giphy-api';
import * as imageSearch from 'node-google-image-search';
import { Format } from './utils';
import * as haiku from 'haiku-random';

let giphy = gip();

class Bot {
    Name: string;
    params: params;
    botparams: botparam;
    slack: slackbot;
    user_name_id: userId;
    user_id_name: userName;
    api: string
    constructor(name: string, botparm: botparam, parm: params) {
        this.Name = name;
        this.params = parm;
        this.botparams = botparm;
        this.slack = new slackbot(this.botparams);
        this.api = "http://version1.api.memegenerator.net//Instances_Search?q={0}&pageIndex=0&pageSize=12&apiKey={1}";
        this.user_id_name = {};
        this.user_name_id = {};

        this.slack.on("start", () => {
            let users = this.slack.getUsers();
            users._value.members.forEach(user => {
                this.user_id_name[user.id] = user.name;
                this.user_name_id[user.name] = user.id;
            });
        });
        this.slack.on("message", (data : slackResponse) => {
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
                if (this.findGreeting(text)) { this.sendGreeting(channel); }
                if (this.findRequest(text)) { 
                    if (text.includes("meme")) { this.sendMeme(text, channel, user); }
                    if (text.includes("gif")) { this.sendGif(text, channel, user); }
                    if (text.match(/nudes?/g)) { this.sendImage(user, channel); }
                    if (text.includes("poem")) { this.sendPoem(user, channel); }
                }
                if (text.includes("tell me a joke") || text.includes("tell a joke")) { this.tellJoke(user, channel); }
                if (text.includes("pick me up") || text.includes("pickup line")) { this.pickupLine(user, channel); }
            }
        } catch (err) {
            console.log('TypeError! \u{1F996}');
        }
    }

    findGreeting(text: string): boolean {
        let greeting: boolean = false;
        messages.greeting.forEach(greet => {
            if (text.includes(greet)) {
                greeting = true;
            }
        });
        return greeting;
    }

    findRequest(text: string): boolean {
        if ((text.includes("send") && text.includes("a")) || 
            text.includes("send a") || text.includes("send me")) {
            return true;
        }
        return false;
    }

    findWithOf(key: string): boolean {
        return key === 'of' || key === 'with';
    }

    getCategory(text: string): string {
        if (text.match(/with|of/g)) {
            let arr = text.split(" ");
            let index = arr.findIndex(this.findWithOf);
            return arr.slice(index+1).join(' ');
        } else {
            return 'random';
        }
    }

    sendGreeting(channel: string): void {
        let greet: string = responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
        this.slack.postMessage(channel, greet, this.params);
    }

    sendMeme(text: string, channel: string, user: string): void {
        let cat: string = this.getCategory(text);
        let args: Array<string> = [cat, process.env.MEME_API];
        let url: string = Format(this.api, args);
        request(url, { json: true }, (err, res, body) => {
            if (err) { return console.error(err); }
            let meme = body.result[Math.floor(Math.random() * body.result.length)].instanceImageUrl;
            this.postMsg(meme, channel, user);
        });
    }

    sendGif(text: string, channel: string, user: string): void {
        let cat: string = this.getCategory(text);
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
        let joke: string = responses.jokes[Math.floor(Math.random() * responses.jokes.length)];
        this.postMsg(joke, channel, user);
    }

    pickupLine(user: string, channel: string): void {
        let pickup: string = responses.pickup[Math.floor(Math.random() * responses.pickup.length)];
        this.postMsg(pickup, channel, user);
    }

    postMsg(attr: string, channel: string, user: string): void {
        let msg: string = messages.return[Math.floor(Math.random() * messages.return.length)];
        let emoji: string = messages.emojis[Math.floor(Math.random() * messages.emojis.length)];
        let args: Array<string> = [user, emoji, attr];
        msg = Format(msg, args);
        this.slack.postMessage(channel, msg, this.params);
    }
}

export { Bot };