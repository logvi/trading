import {observable, action} from 'mobx';
import api from '../api';

class SymbolsStore {
  @observable data = [];

  @action setData = data => {
    if (!data) return;
    this.data = data;
  };

  @action getData = () => {
    api.getSymbols().then(data => {
      this.setData(data);
    });
  };
}

export default SymbolsStore;