import {observable, action} from 'mobx';
import api from '../api';

class TradesTotalsStore {
  @observable closedTradesNumber = 0;
  @observable openTradesNumber = 0;
  @observable profit = {
    today: 0,
    thisMonth: 0,
    previousMonth: 0,
    all: 0
  };
  @observable openTradesVolume = 0;
  @observable openTradesSLVolume = 0;

  @action getData = () => {
    api.getTotals().then(data => {
      console.log(data);
    });
  };

  @action getClosedTradesNumber = () => {

  };
}

export default TradesTotalsStore;