import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';

@inject('trades')
@observer
class TradesTotals extends Component {
  render() {
    const totals = this.props.trades.totals;
    // const {} = totals;
    return (
      <div className="trades-totals">
        <div>
          <div>Closed Trades: 3</div>
          <div>Profit: 300</div>
          <div>Profit for: 500</div>
        </div>
        <div>
          <div>Open Trades: 3</div>
          <div>Volume: 300</div>
          <div>Stop Loss Volume: 500</div>
        </div>
      </div>
    )
  }
}

export default TradesTotals;