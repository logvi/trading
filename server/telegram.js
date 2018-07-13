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

bot.sendTotalMessage = sendTotalMessage;
bot.sendTradeMessage = sendTradeMessage;

function sendTradeMessage(tradeData) {
  if (!tradeData.amount) return;
  let msg = [];
  msg.push(tradeData.profit ? '#close' : '#open');
  msg.push(`#trade${tradeData.id}`);
  msg.push(tradeData.type === 'BUY' ? 'ПОКУПКА' : 'ПРОДАЖА');
  if (tradeData.timeOpen) msg.push(`Время открытия: <b>${tradeData.timeOpen.toLocaleString('ru-Ru')}</b>`);
  if (tradeData.symbol.symbol) msg.push(`Инструмент: <b>${tradeData.symbol.symbol}</b>`);
  if (tradeData.priceOpen) msg.push(`Цена открытия: <b>${tradeData.priceOpen}</b>`);
  if (tradeData.amount) msg.push(`Количество: <b>${tradeData.amount}</b>`);
  if (tradeData.volume) msg.push(`Объём сделки: <b>${tradeData.volume}</b>`);
  if (tradeData.stopLoss) msg.push(`Стоп лосс: <b>${tradeData.stopLoss}</b>`);
  if (tradeData.timeClose) msg.push(`Время закрытия: <b>${tradeData.timeClose.toLocaleString('ru-Ru')}</b>`);
  if (tradeData.priceClose) msg.push(`Цена закрытия: <b>${tradeData.priceClose}</b>`);
  if (tradeData.profit) msg.push(`Профит: <b>${tradeData.profit}</b>`);
  bot.sendMessage(chatId, msg.join('\n'), {parse_mode: 'HTML'});
}

function sendTotalMessage(totalData) {
  bot.sendMessage(chatId, `ИТОГ
Открыто трейдов: <b>${totalData.openTradesCount}</b> 
общим объёмом <b>${totalData.openVolume}</b>
Общий профит: <b>${totalData.profit}</b>, 
за прошлый месяц: <b>${totalData.profitLastMonth}</b>
за текущий месяц: <b>${totalData.profitThisMonth}</b>
за сегодня: <b>${totalData.profitToday}</b>`, {
    parse_mode: 'HTML'
  });
}

module.exports = bot;