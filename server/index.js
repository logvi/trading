require('./db');
const Trade = require('./Trade');
const Symbol = require('./Symbol');

function setTrade(data) {
  return new Promise((resolve, reject) => {
    const symbolData = data.symbol;
    Symbol.findOneAndUpdate({symbol: symbolData.symbol}, {
      symbol: symbolData.symbol,
      priceStep: symbolData.priceStep,
      priceStepCost: symbolData.priceStepCost,
      go: symbolData.go
    }, {upsert: true, new: true, setDefaultsOnInsert: true}).then(symbol => {
      const trade = new Trade({
        amount: data.amount,
        type: data.type,
        priceOpen: data.priceOpen,
        timeOpen: data.timeOpen,
        priceClose: data.priceClose,
        timeClose: data.timeClose,
        stopLoss: data.stopLoss,
        volume: data.volume,
        stopLossVolume: data.stopLossVolume,
        profit: data.profit,
        symbol: symbol._id
      });

      return trade.save().then(trade => resolve(trade)).catch(err => reject(err));
    });
  });
}

setTrade({
  symbol: {
    symbol: 'SIM8',
    priceStep: 0.2,
    priceStepCost: 3,
    go: 4000
  },
  amount: 10,
  type: 'SELL',
  priceOpen: 206.58,
  timeOpen: new Date()
}).then(result => {
  console.log('success', result)
}).catch(err => console.log('error', err));