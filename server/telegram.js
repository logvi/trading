const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, {polling: true});

bot.getChat('@tradervitalik').then((chat) => {
  // console.log('chatId', chat);
});

module.exports = bot;