import {observable, action} from 'mobx';

class TradeStore {
  @observable ticket = null;

  @action setTicket = value => {
    this.ticket = value;
  }
}

export default TradeStore;