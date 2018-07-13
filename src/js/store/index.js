import {action} from 'mobx';
import TradesStore from './TradesStore';
import ModalStore from './ModalStore';
import TradeStore from './TradeStore';
import SymbolsStore from './SymbolsStore';
import LoaderStore from './LoaderStore';
import Router from './Router';

class Store {
  trades = new TradesStore(this);
  modal = new ModalStore();
  loader = new LoaderStore();
  router = new Router(this);
  trade = new TradeStore(this);
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