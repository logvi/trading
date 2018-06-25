const mongoose = require('mongoose');

const symbolSchema = mongoose.Schema({
  symbol: {type: String, unique : true, required : true, dropDups: true},
  priceStep: {type: Number, default: 1},
  priceStepCost: {type: Number, default: 1},
  go: Number
});

const Symbol = mongoose.model('Symbol', symbolSchema);
module.exports = Symbol;