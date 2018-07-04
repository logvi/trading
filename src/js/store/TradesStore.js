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
    this.setLoading(true);
    api.getTrades().then(data => {
      this.setData(data);
      this.setLoading(false);
    });
    this.totals.getData();
  }

  @action setData(data) {
    this.data = data;
  }

  @action setLoading(value) {
    this.isLoading = value;
  }
}

export default TradesStore;