const http = require('http');
const mongoose = require('mongoose');
const io = require('socket.io')();
require('./db');
const Trade = require('./Trade');
const Symbol = require('./Symbol');

const server = http.createServer((req, res) => {}).listen(3000, () => {
  console.log('server is running on 3000');
});

io.attach(server);

io.on('connection', socket => {
  console.log('user connected');

  socket.on('getTrades', data => {
    console.log('getTrades', data);
    getTrades().then(trades => {
      socket.emit('getTrades', {msgId: data.msgId, data: {trades}});
    });
  });
});

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
      if (!data._id) {
        data._id = new mongoose.mongo.ObjectID();
      }
      console.log(data._id);
      Trade.findOneAndUpdate({_id: data._id},{
        _id: data._id,
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

function getTotalProfit(filter) {
  let actions = [];
  if (filter) {
    actions.push({
      $match: filter
    });
  }

  actions.push( {
    $group: {
      _id: null,
      total: {$sum: '$profit'}
    }
  });

  return Trade.aggregate(actions);
}

function getOpenVolume() {
  return Trade.aggregate([
    {
      $match: {
        timeClose: null
      },
    },
    {
      $group: {
        _id: null,
        total: {$sum: '$volume'}
      }
    }
  ]);
}

function getOpenStopLossVolume() {
  return Trade.aggregate([
    {
      $match: {
        timeClose: null
      },
    },
    {
      $group: {
        _id: null,
        total: {$sum: '$stopLossVolume'}
      }
    }
  ]);
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
//   timeOpen: new Date(),
//   volume: 10,
//   timeClose: new Date()
// }).then(result => {
//   console.log('success', result)
// }).catch(err => console.log('error', err));

// getTrades().then(trades => console.log(trades));

// getOpenVolume().then(res => console.log(res));

// let d = new Date();
// d.setMonth(d.getMonth() - 1);
// getTotalProfit({timeClose: {$lte: d}}).then(res => console.log(res));