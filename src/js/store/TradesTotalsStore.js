import {observable, action} from 'mobx';
import api from '../api';

class TradesTotalsStore {
  @observable closedTradesNumber = 0;
  @observable openTradesNumber = 0;
  @observable profit = 0;
  @observable profitToday = 0;
  @observable profitThisMonth = 0;
  @observable profitLastMonth = 0;
  @observable openVolume = 0;
  @observable openStopLossVolume = 0;

  @action getData = () => {
    return new Promise((resolve, reject) => {
      api.getTotals().then(data => {
        this.closedTradesNumber = data.closedTradesCount;
        this.openTradesNumber = data.openTradesCount;
        this.profit = data.profit;
        this.profitToday = data.profitToday;
        this.profitThisMonth = data.profitThisMonth;
        this.profitLastMonth = data.profitLastMonth;
        this.openVolume = data.openVolume;
        this.openStopLossVolume = data.openStopLossVolume;
        resolve(true);
      });
    });
  };
}

export default TradesTotalsStore;