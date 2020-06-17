# Discord trade notification bot

## How to use
Rename template.env to .env and populate with your data

```
TOKEN=       <discord bot token>
LOGFILE=     <file to read tf2-automatic trades> 
CHANNEL_ID=  <channel to post messages>

default logfile: tf2-automatic/logs/<steamID>.trade.log
```
Then install dependencies and run
```console
$ npm i
$ npm start
```

To set up a new discord server or get tokens and channed_id of a server check this: [tutorial](https://www.sitepoint.com/discord-bot-node-js/)