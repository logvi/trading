import {observable, action} from 'mobx';
import api from '../api';
import TradesTotalsStore from './TradesTotalsStore';

class TradesStore {
  @observable data = [];
  @observable isLoading = false;
  @observable orderBy = {};
  totals = new TradesTotalsStore();

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action setOrderBy = (value) => {
    this.orderBy = value;
  };

  @action getData() {
    this.setLoading(true);
    return new Promise((resolve, reject) => {
      Promise.all([
        api.getTrades(),
        this.rootStore.symbols.getData()
      ]).then(([
        trades,
        symbols
      ]) => {
        this.setData(trades);
        this.setLoading(false);
        resolve(true);
      });
    });
  }

  @action refresh() {
    this.setLoading(true);
    Promise.all([
      this.getData(),
      this.totals.getData()
    ]).then(() => {
      this.setLoading(false);
    });
  }

  @action setData(data) {
    this.data = data;
  }

  @action setLoading(value) {
    this.isLoading = value;
  }
}

export default TradesStore;