import {observable, action} from 'mobx';

class TradeStore {
  @observable ticket = null;
  @observable amount = 0;
  @observable type = 'BUY';

  @action setTicket = value => {
    this.ticket = value;
  };

  @action setValue = (field, value) => {
    if (!this.hasOwnProperty(field)) return;
    this[field] = value;
  };
}

export default TradeStore;