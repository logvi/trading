import {observable, action, autorun} from 'mobx';
import api from '../api';

class TradeStore {
  @observable data = null;

  constructor() {
    autorun(() => this.calculateVolume());
    autorun(() => this.calculateStopLossVolume());
    autorun(() => this.calculateProfit());
  }

  calculateVolume = () => {
    if (!this.data) return;
    const price = this.data.symbol.go || this.data.priceOpen;
    const volume = this.data.amount * price;
    this.setValue('volume', volume);
  };

  calculateStopLossVolume = () => {
    if (!this.data) return;
    if (!this.data.stopLoss) return;
    const res = (Math.abs(this.data.priceOpen - this.data.stopLoss))/this.data.symbol.priceStep*this.data.symbol.priceStepCost*this.data.amount;
    this.setValue('stopLossVolume', res);
  };

  calculateProfit = () => {
    if (!this.data) return;
    if (!this.data.priceClose) return;
    const koef = this.data.type === 'BUY' ? -1 : 1;
    const res = (this.data.priceOpen - this.data.priceClose)/this.data.symbol.priceStep*this.data.symbol.priceStepCost*this.data.amount*koef;
    this.setValue('profit', res);
  };

  @action setValue = (field, value) => {
    if (field === '_id') return this.data[field] = value;
    if (this.data.symbol.hasOwnProperty(field)) return this.setSymbol(field, value);
    if (!this.data.hasOwnProperty(field)) return;
    this.data[field] = value;
  };

  @action setSymbol = (field, value) => {
    if (!this.data.symbol.hasOwnProperty(field)) return;
    this.data.symbol[field] = value;
  };

  @action setData = (data = {
    _id: 'new',
    id: null,
    amount: 0,
    type: 'BUY',
    priceOpen: 0,
    timeOpen: new Date(),
    priceClose: 0,
    timeClose: '',
    stopLoss: 0,
    volume: 0,
    stopLossVolume: 0,
    profit: 0,
    symbol: {
      symbol: '',
      priceStep: 1,
      priceStepCost: 1,
      go: ''
    }
  }) => {
    data.timeOpen = data.timeOpen ? new Date(data.timeOpen) : '';
    data.timeClose = data.timeClose ? new Date(data.timeClose) : '';
    this.data = data;
  };

  @action getTrade = _id => {
    api.getTrades({filter: {_id}}).then(trade => {
      this.setData(trade);
    });
  };

  @action save = () => {
    return new Promise((resolve, reject) => {
      api.setTrade(this.data).then(trade => {
        this.clear();
        resolve(trade);
      });
    });
  };

  @action clear = () => {
    this.data = null;
  };

  @action remove = () => {
    if (!this.data) return;
    return new Promise((resolve, reject) => {
      api.deleteTrade(this.data._id).then(() => {
        this.clear();
        resolve(true);
      });
    });
  };
}

export default TradeStore;