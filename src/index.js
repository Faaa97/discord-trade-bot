require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const TOKEN = process.env.TOKEN;
const LOGFILE = process.env.LOGFILE;

// console.log(LOGFILE);
const channelID = '684255279025750018';
let tradeLogChannel;

bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
  // console.log(bot);
  tradeLogChannel = bot.channels.cache.get(channelID);
  // console.log(tradeLogChannel);
});

fs.watchFile(LOGFILE, (eventType, data) => {
  if(eventType === 'change') {
    // console.log(data);
    const token = 'Summary';
    const index = data.message.indexOf(token);
    if(index !== -1) {
      const message = data.message.slice(index + token.length);
      tradeLogChannel.send(message);
    }
  }

});

bot.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});
