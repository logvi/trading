import TradesStore from './TradesStore';
import ModalStore from './ModalStore';
import TradeStore from './TradeStore';
import api from '../api';

class Store {
  trades = new TradesStore();
  modal = new ModalStore();
  trade = new TradeStore();

  constructor() {
    api.connect();
  }
}

export default Store;