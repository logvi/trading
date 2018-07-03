import Server from './Server';

class Api extends Server {
  getTrades = (params = {}) => {
    return new Promise((resolve, reject) => {
      this.send('getTrades', params, response => {
        resolve(response.trades);
      });
    });
  };
}

export default new Api();