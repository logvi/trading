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
  router = new Router(this);
  trade = new TradeStore(this);
  symbols = new SymbolsStore();
  user = new UserStore(this);
  view = new ViewStore();

  constructor() {
    if (!api.connected) {
      setLoading('Connecting to server...');
      api.connect(this.user.token);
      api.on('connect', async() => {
        setLoading(false);
        this.router.resolve(location);
      });
    }
  }
}

export default Store;