import {action} from 'mobx';
import TradesStore from './TradesStore';
import ModalStore from './ModalStore';
import TradeStore from './TradeStore';
import api from '../api';
import Router from './Router';

class Store {
  trades = new TradesStore();
  modal = new ModalStore();
  trade = new TradeStore();
  router = new Router(this);

  constructor() {
    this.router.resolve(location);
  }

  @action openView = view => {
    switch(view) {
      case 'home':
        this.trades.getData();
        break;
    }
  }
}

export default Store;