import Server from './Server';

class Api extends Server {
  getTrades = (params = {}) => {
    return new Promise((resolve, reject) => {
      this.send('getTrades', params, response => {
        resolve(response.trades);
      });
    });
  };

  setTrade = (params = {}) => {
    return new Promise((resolve, reject) => {
      this.send('setTrade', params, response => {
        resolve(response.trade);
      });
    });
  };

  deleteTrade = (_id) => {
    return new Promise((resolve, reject) => {
      this.send('deleteTrade', {_id}, response => {
        resolve(response);
      });
    });
  };

  getTotals = () => {
    return new Promise((resolve, reject) => {
      this.send('getTotals', {}, response => {
        resolve(response);
      });
    });
  };

  onTotals = callback => {
    this.on('getTotals', response => {
      callback(response.data)
    });
  };

  getSymbols = () => {
    return new Promise((resolve, reject) => {
      this.send('getSymbols', {}, response => {
        resolve(response);
      });
    });
  };

  login = (params = {}) => {
    return new Promise((resolve, reject) => {
      this.send('login', params, response => {
        resolve(response);
      });
    });
  }
}

export default new Api();