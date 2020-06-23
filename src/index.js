const Discord = require('discord.js');
const Tail = require('tail-file');

require('dotenv').config();
const TOKEN = process.env.TOKEN;
const LOGFILE = process.env.LOGFILE;
const CHANNEL_ID = process.env.CHANNEL_ID;

const bot = new Discord.Client();
let tradeLogChannel;


const trades = [];

const checkTrades = setInterval(() => {
  const now = Date.now();
  let toRemove = [];
  trades.forEach((trade) => {
    if(now - trade.startTime > 29 * 60 * 1000) {
      toRemove.push(trade.id);
    }
  })

  toRemove.forEach((id) => {
    const trade = removeTradeFromQueue(id);
    const message = 'Trade stuck from ' + trade.id;
    console.log(message);
    tradeLogChannel.send(message);
  });
}, 30 * 60 * 1000)

const makeTrade = (num, steamid, message, start) => {
  return {
    id: num,
    steamId: steamid,
    message: message,
    startTime: start,
    endTime: null,
  };
}

const putTradeInQueue = (trade) => {
  trades.push(trade);
}

const removeTradeFromQueue = (id) => {
  for(let i = 0; i < trades.length; i++) {
    if(trades[i].id === id) {
      const trade = trades[i];
      trades.slice(i, 1);
      return trade;
    }
  }
}




/* Trade log config */

const log = new Tail(LOGFILE);

log.on('line', (line) => {
  // console.log(line);  
  const trade = JSON.parse(line);
  const message = trade.message;

  const summaryToken = 'Summary';

  const match = message.match(/Offer #(\d+) from (\d+)/);

  if (match) {
    const offerNum = match[1];
    const steamID = match[2];
    const index = message.indexOf(summaryToken);

    if(index !== -1) {
      const mes = message.slice(index + summaryToken.length + 2);
      const t = makeTrade(offerNum, steamID, mes, new Date(trade.timestamp));
      putTradeInQueue(t);
    } else if(message.includes('has been accepted')) {
      const t = removeTradeFromQueue(offerNum);
      const delay = (new Date(trade.timestamp) - t.startTime) / 1000;
      const realMessage = t.message + '\nDelay: ' + delay + ' s';

      console.log('New trade: ' + realMessage);
      tradeLogChannel.send(realMessage);
    }
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
