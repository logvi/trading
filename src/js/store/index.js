import {action} from 'mobx';
import TradesStore from './TradesStore';
import ModalStore from './ModalStore';
import TradeStore from './TradeStore';
import SymbolsStore from './SymbolsStore';
import Router from './Router';

class Store {
  trades = new TradesStore(this);
  modal = new ModalStore();
  router = new Router(this);
  trade = new TradeStore();
  symbols = new SymbolsStore();

  constructor() {
    this.router.resolve(location);
  }

  @action openView = view => {
    switch(view) {
      case 'home':
        this.trades.refresh();
        break;
    }
  };
}

export default Store;