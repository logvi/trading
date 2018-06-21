class Api {
  getTrades = params => {
    return new Promise((resolve, reject) => {
       resolve(JSON.parse(localStorage.getItem('trades')));
    });
  };

  addTrade = params => {
    return new Promise((resolve, reject) => {
      const {openTime, closeTime, ticket, priceOpen, priceClose, type, sl, tp, amount, profit} = params;
      let trades = localStorage.getItem('trades');
      JSON.parse(trades);
      trades.push({openTime, closeTime, ticket, priceOpen, priceClose, type, sl, tp, amount, profit});
      localStorage.setItem('trades', JSON.stringify(trades));
      resolve(true);
    });
  };
}

export default Api;