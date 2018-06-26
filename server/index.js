require('./db');
const Trade = require('./Trade');
const Symbol = require('./Symbol');

function setTrade(data) {
  return new Promise((resolve, reject) => {
    const symbolData = data.symbol;
    const options = {upsert: true, new: true, setDefaultsOnInsert: true};
    Symbol.findOneAndUpdate({symbol: symbolData.symbol}, {
      symbol: symbolData.symbol,
      priceStep: symbolData.priceStep,
      priceStepCost: symbolData.priceStepCost,
      go: symbolData.go
    }, options).then(symbol => {
      Trade.findOneAndUpdate({_id: data._id},{
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
      }, options).then(trade => resolve(trade)).catch(err => reject(err));
    });
  });
}

function getTrades(params = {}) {
  const {filter = {}} = params;
  if (filter._id) return Trade.findById(filter._id).populate('symbol');
  return Trade.find(filter).populate('symbol').sort({timeOpen: -1});
}

function getTradesCount() {
  return Trade.count();
}

function getOpenTradesCount() {
  return Trade.count(({timeClose: null}));
}

function getClosedTradesCount() {
  return Trade.count(({timeClose: {$ne: null}}));
}

// setTrade({
//   symbol: {
//     symbol: 'SIM8',
//     priceStep: 0.2,
//     priceStepCost: 3,
//     go: 4000
//   },
//   amount: 10,
//   type: 'SELL',
//   priceOpen: 206.58,
//   timeOpen: new Date()
// }).then(result => {
//   console.log('success', result)
// }).catch(err => console.log('error', err));

// getTrades().then(trades => console.log(trades));