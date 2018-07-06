import {observable, action} from 'mobx';
import api from '../api';
import TradesTotalsStore from './TradesTotalsStore';

class TradesStore {
  @observable data = [];
  @observable isLoading = false;
  @observable orderBy = {};
  totals = new TradesTotalsStore();

  @action setOrderBy = (value) => {
    this.orderBy = value;
  };

  @action getData() {
    return new Promise((resolve, reject) => {
      api.getTrades().then(data => {
        this.setData(data);
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