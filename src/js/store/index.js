import api from '../api';
import setLoading from '../utils/setLoading';
import TradesStore from './TradesStore';
import ModalStore from './ModalStore';
import TradeStore from './TradeStore';
import SymbolsStore from './SymbolsStore';
import LoaderStore from './LoaderStore';
import ViewStore from './ViewStore';
import UserStore from './UserStore';
import Router from './Router';

class Store {
  trades = new TradesStore(this);
  modal = new ModalStore();
  loader = new LoaderStore();
  user = new UserStore(this);
  trade = new TradeStore(this);
  symbols = new SymbolsStore();
  view = new ViewStore();
  router = new Router(this);

  constructor() {
    this.router.resolve(location);
  }
}

export default Store;