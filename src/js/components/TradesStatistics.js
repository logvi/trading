import React, {Component} from 'react';

class TradesStatistics extends Component {
  render() {
    return (
      <div className="trades-statistics">
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

export default TradesStatistics;