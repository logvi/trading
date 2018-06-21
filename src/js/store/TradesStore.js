import {observable, action} from 'mobx';

class TradesStore {
  @observable data = [];
  @observable isLoading = false;
  @observable orderBy = {};

  @action setOrderBy = (value) => {
    this.orderBy = value;
  }
}

export default TradesStore;