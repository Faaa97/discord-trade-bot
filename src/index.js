const Discord = require('discord.js');
const Tail = require('tail-file');

require('dotenv').config();
const TOKEN = process.env.TOKEN;
const LOGFILE = process.env.LOGFILE;
const CHANNEL_ID = process.env.CHANNEL_ID;

const bot = new Discord.Client();
let tradeLogChannel;

/* Trade log config */ 

const log = new Tail(LOGFILE);

log.on('line', (line) => {
  console.log(line);
  const token = 'Summary';
  const message = JSON.parse(line).message;
  const index = message.indexOf(token);
  if(index !== -1) {
    const mes = message.slice(index + token.length + 2);
    tradeLogChannel.send(mes);
  }
});

log.start();

/* Bot config */

bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
  tradeLogChannel = bot.channels.cache.get(CHANNEL_ID);
});

bot.on('message', msg => {
  if (msg.content === '!cat') {
    msg.reply('pong');
  }
});
