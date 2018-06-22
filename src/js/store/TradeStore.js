import {observable, action, autorun} from 'mobx';

class TradeStore {
  @observable ticket = null;
  @observable amount = 0;
  @observable type = 'BUY';
  @observable priceOpen = 0;
  @observable timeOpen = new Date().toJSON().split('.')[0];
  @observable priceClose = 0;
  @observable timeClose = new Date().toJSON().split('.')[0];
  @observable stopLoss = 0;
  @observable volume = 0;
  @observable stopLossVolume = 0;
  @observable profit = 0;
  @observable symbol = {
    symbol: '',
    priceStep: 1,
    priceStepCost: 1,
    go: ''
  };

  constructor() {
    autorun(() => this.calculateVolume());
    autorun(() => this.calculateStopLossVolume());
    autorun(() => this.calculateProfit());
  }

  calculateVolume = () => {
    const price = this.symbol.go || this.priceOpen;
    const volume = this.amount * price;
    this.setValue('volume', volume);
  };

  calculateStopLossVolume = () => {
    if (!this.stopLoss) return;
    const res = (Math.abs(this.priceOpen - this.stopLoss))/this.symbol.priceStep*this.symbol.priceStepCost*this.amount;
    this.setValue('stopLossVolume', res);
  };

  calculateProfit = () => {
    if (!this.priceClose) return;
    const koef = this.type === 'BUY' ? -1 : 1;
    const res = (this.priceOpen - this.priceClose)/this.symbol.priceStep*this.symbol.priceStepCost*this.amount*koef;
    this.setValue('profit', res);
  };

  @action setTicket = value => {
    this.ticket = value;
  };

  @action setValue = (field, value) => {
    if (this.symbol.hasOwnProperty(field)) return this.setSymbol(field, value);
    if (!this.hasOwnProperty(field)) return;
    this[field] = value;
  };

  @action setSymbol = (field, value) => {
    if (!this.symbol.hasOwnProperty(field)) return;
    this.symbol[field] = value;
  };
}

export default TradeStore;