const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, {polling: true});
let chatId;

bot.getChat(config.TELEGRAM_CHANEL).then(chat => {
  chatId = chat.id;

  // sendTradeMessage({
  //   id: 1,
  //   type: 'BUY',
  //   timeOpen: '21.01.2019',
  //   symbol: {
  //     symbol: 'SIM8'
  //   },
  //   priceOpen: 90,
  //   amount: 10,
  //   profit: 100
  // });
  // sendTotalMessage({
  //   openTradesCount: 2,
  //   openVolume: '3000',
  //   profit: '10000',
  //   profitLastMonth: 0,
  //   profitToday: 2234,
  //   profitThisMonth: 1234
  // })
});

function sendTradeMessage(tradeData) {
  let msg = [];
  msg.push(tradeData.profit ? '#close' : '#open');
  msg.push(`#trade${tradeData.id}`);
  msg.push(tradeData.type === 'BUY' ? 'ПОКУПКА' : 'ПРОДАЖА');
  if (tradeData.timeOpen) msg.push(`Время открытия: ${tradeData.timeOpen}`);
  if (tradeData.symbol.symbol) msg.push(`Инструмент: ${tradeData.symbol.symbol}`);
  if (tradeData.priceOpen) msg.push(`Цена открытия: ${tradeData.priceOpen}`);
  if (tradeData.amount) msg.push(`Количество: ${tradeData.amount}`);
  if (tradeData.volume) msg.push(`Объём сделки: ${tradeData.volume}`);
  if (tradeData.stopLoss) msg.push(`Стоп лосс: ${tradeData.stopLoss}`);
  if (tradeData.timeClose) msg.push(`Время закрытия: ${tradeData.timeClose}`);
  if (tradeData.priceClose) msg.push(`Цена закрытия: ${tradeData.priceClose}`);
  if (tradeData.profit) msg.push(`Профит: ${tradeData.profit}`);
  bot.sendMessage(chatId, msg.join('\n'), {parse_mode: 'HTML'});
}

function sendTotalMessage(totalData) {
  bot.sendMessage(chatId, `ИТОГ
Открыто трейдов: <b>${totalData.openTradesCount}</b> общим объёмом <b>${totalData.openVolume}</b>
Общий профит: <b>${totalData.profit}</b>, за прошлый месяц: <b>${totalData.profitLastMonth}</b>
Профит за сегодня: <b>${totalData.profitToday}</b>, за текущий месяц: <b>${totalData.profitThisMonth}</b>`, {
    parse_mode: 'HTML'
  });
}

module.exports = bot;