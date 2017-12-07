const cfg = require('./config.json');
const Bot = require('node-telegram-bot-api');
const bot = new Bot( cfg['telegram-token'], { polling: true } );

module.exports = bot;