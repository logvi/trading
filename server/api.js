require('./db');
const mongoose = require('mongoose');
const utils = require('./utils');
const Trade = require('./Trade');
const Symbol = require('./Symbol');
const User = require('./User');
// const telegramBot = require('./telegram');
const jwt = require('jsonwebtoken');
const config = require('./config');

function startApi(socket) {
  socket.on('login', request => {
    console.log('login', request);
    User.findOne({username: request.data.username}).then(user => {
      if (!user) {
        socket.emit('alert', {msgId: request.msgId, data: {message: 'User ' + request.data.username + ' not found'}});
        return;
      }
      user.comparePassword(request.data.password, (err, isMatch) => {
        console.log('compare pwd', isMatch);
        if (isMatch) {
          // do login
          const token = jwt.sign({username: user.username}, config.JWT_SECRET);
          socket.emit('login', {msgId: request.msgId, data: {token}});
          socket.token = {username: user.username};
        } else {
          socket.emit('alert', {msgId: request.msgId, data: {message: 'Password is not correct'}});
        }
      });
    }).catch((err) => {
      console.log(err);
    });
  });

  // Authenticated
  if (socket.token) {
    socket.emit('authenticated', socket.token);

    socket.on('getTrades', request => {
      console.log('getTrades', request);
      getTrades(request.data).then(trades => {
        socket.emit('getTrades', {msgId: request.msgId, data: {trades}});
      });
    });

    socket.on('setTrade', request => {
      console.log('setTrade', request);
      setTrade(request.data).then(trade => {
        Trade.populate(trade, {path: 'symbol'}).then(trade => {
          socket.emit('setTrade', {msgId: request.msgId, data: {trade}});
          telegramBot.sendTradeMessage(trade);

          getTotals().then(totalData => {
            socket.emit('getTotals', {msgId: request.msgId, data: totalData});
            telegramBot.sendTotalMessage(totalData);
          });
        });
      }).catch(err => {
        socket.emit('alert', {msgId: request.msgId, data: {message: err.message}});
      });
    });

    socket.on('deleteTrade', request => {
      console.log('deleteTrade', request);
      deleteTrade(request.data._id).then(trade => {
        socket.emit('deleteTrade', {msgId: request.msgId, data: {trade}});
      });
    });

    socket.on('getTotals', request => {
      console.log('getTotals', request);
      getTotals().then(totalsData => {
        socket.emit('getTotals', {msgId: request.msgId, data: totalsData});
      });
    });

    socket.on('getSymbols', request => {
      console.log('getSymbols', request);
      getSymbols().then(symbols => {
        socket.emit('getSymbols', {msgId: request.msgId, data: symbols});
      });
    });
  }
}

function addUser({username, password}) {
  let user = new User({
    username,
    password
  });

  return user.save();
}

function setTrade(data) {
  return new Promise((resolve, reject) => {
    const symbolData = data.symbol;
    Symbol.findOne({symbol: symbolData.symbol}).then(symbol => {
      if (!symbol) symbol = new Symbol();

      symbol.symbol = symbolData.symbol;
      symbol.priceStep = symbolData.priceStep;
      symbol.priceStepCost = symbolData.priceStepCost;
      symbol.go = symbolData.go;

      symbol.save().then(symbol => {
        if (!data._id || data._id === 'new') {
          data._id = new mongoose.mongo.ObjectID();
        }
        Trade.findById(data._id).then(trade => {
          if (!trade) trade = new Trade();

          trade.amount = data.amount;
          trade.type = data.type;
          trade.priceOpen = data.priceOpen;
          trade.timeOpen = data.timeOpen;
          trade.priceClose = data.priceClose;
          trade.timeClose = data.timeClose;
          trade.stopLoss = data.stopLoss;
          trade.volume = data.volume;
          trade.stopLossVolume = data.stopLossVolume;
          trade.profit = data.profit;
          trade.symbol = symbol._id;

          trade.save().then(trade => resolve(trade)).catch(err => reject(err));
        });
      }).catch(err => {
        reject(err);
      });
    });
  });
}

function getTrades(params = {}) {
  const {filter = {}} = params;
  if (filter._id) return Trade.findById(filter._id).populate('symbol');
  return Trade.find(filter).populate('symbol').sort({timeOpen: -1});
}

function deleteTrade(_id) {
  return Trade.findByIdAndDelete(_id);
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

function getTotalProfit({dateFrom, dateTo} = {}) {
  let actions = [];
  if (dateFrom) {
    actions.push({
      $match: {timeClose: {$gt: new Date(dateFrom), $lt: new Date(dateTo)}}
    });
  }

  actions.push( {
    $group: {
      _id: null,
      total: {$sum: '$profit'}
    }
  });
  return new Promise((resolve, reject) => {
    Trade.aggregate(actions).then(data => {
      if (data.length) {
        resolve(data[0].total)
      } else {
        resolve(0);
      }
    });
  });
}

function getOpenVolume() {
  return new Promise((resolve, reject) => {
    Trade.aggregate([
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
    ]).then(data => {
      if (data.length) {
        resolve(data[0].total)
      } else {
        resolve(0);
      }
    });
  });
}

function getOpenStopLossVolume() {
  return new Promise((resolve, reject) => {
    Trade.aggregate([
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
    ]).then(data => {
      if (data.length) {
        resolve(data[0].total)
      } else {
        resolve(0);
      }
    });
  });
}

function getTotals() {
  return new Promise((resolve, reject) => {
    let dateFilterToday = utils.getDateFilter('today'),
      dateFilterThisMonth = utils.getDateFilter('thisMonth'),
      dateFilterLastMonth = utils.getDateFilter('lastMonth');

    Promise.all([
      getOpenTradesCount(),
      getClosedTradesCount(),
      getOpenVolume(),
      getOpenStopLossVolume(),
      getTotalProfit(), //all
      getTotalProfit(dateFilterToday), //today
      getTotalProfit(dateFilterThisMonth), //this month
      getTotalProfit(dateFilterLastMonth), //last month
    ]).then(([
      openTradesCount,
      closedTradesCount,
      openVolume,
      openStopLossVolume,
      profit,
      profitToday,
      profitThisMonth,
      profitLastMonth
    ]) => {
      resolve({
        openTradesCount,
        closedTradesCount,
        openVolume,
        openStopLossVolume,
        profit,
        profitToday,
        profitThisMonth,
        profitLastMonth
      });
    });
  });
}

function getSymbols() {
  return Symbol.find({});
}

// setTrade({
//   symbol: {
//     symbol: 'SIM85665436',
//     priceStep: 0.2,
//     priceStepCost: 3,
//     go: 4000
//   },
//   amount: 1000,
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

// getTotalProfit().then(res => console.log('total', res));
// getTotalProfit(utils.getDateFilter('today')).then(response => console.log('today', response));
// getTotalProfit(utils.getDateFilter('lastMonth')).then(response => console.log('lastMonth', response));
// getTotalProfit(utils.getDateFilter('thisMonth')).then(response => console.log('thisMonth', response));
// getOpenTradesCount().then(res => console.log(res));

module.exports = startApi;