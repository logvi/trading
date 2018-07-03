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
}

export default new Api();