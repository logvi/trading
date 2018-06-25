const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const tradeSchema = mongoose.Schema({
  id: Number,
  amount: Number,
  type: String,
  priceOpen: Number,
  timeOpen: Date,
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