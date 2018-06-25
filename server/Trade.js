const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const tradeSchema = mongoose.Schema({
  id: Number,
  amount: {type: Number, required: true},
  type: {type: String, required: true, match: /^SELL$|^BUY$/},
  priceOpen: {type: Number, required: true},
  timeOpen: {type: Date, required: true},
  priceClose: Number,
  timeClose: Date,
  stopLoss: Number,
  volume: Number,
  stopLossVolume: Number,
  profit: Number,
  symbol: {type: mongoose.Schema.Types.ObjectId, ref: 'Symbol'}
});

tradeSchema.plugin(autoIncrement.plugin, {model: 'Trade', field: 'id'});
const Trade = mongoose.model('Trade', tradeSchema);
module.exports = Trade;