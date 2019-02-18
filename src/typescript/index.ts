import * as dotenv from 'dotenv';
import * as express from 'express';
import * as path from 'path';
import { Bot } from './bot';

dotenv.config();
let app = express();
app.use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .listen(process.env.PORT, (err) => {
        if (err) { throw err; }
        console.log(`\n🚀  Stan LIVES on PORT ${process.env.PORT} 🚀`);
    });

let params = {
    slackbot: true,
    icon_emoji: ':stan:'
}

let slackparams = {
    token: process.env.SLACK_TOKEN,
    name: "Stan"
}

let stan = new Bot("Stan", slackparams, params);

