import TradesStore from './TradesStore';
import ModalStore from './ModalStore';
import TradeStore from './TradeStore';

class Store {
  trades = new TradesStore();
  modal = new ModalStore();
  trade = new TradeStore();
}

export default Store;