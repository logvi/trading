import {observable, action} from 'mobx';
import api from '../api';

class TradesStore {
  @observable.shallow data = [];
  @observable isLoading = false;
  @observable orderBy = {};

  @action setOrderBy = (value) => {
    this.orderBy = value;
  };

  @action getData() {
    this.setLoading(true);
    api.getTrades().then(data => {
      this.setData(data);
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