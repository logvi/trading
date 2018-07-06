import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';

@inject('trades')
@observer
class TradesTotals extends Component {
  render() {
    const totals = this.props.trades.totals;
    const {closedTradesNumber, openTradesNumber, profit, profitToday, profitThisMonth, profitLastMonth, openVolume, openStopLossVolume} = totals;
    return (
      <div className="trades-totals">
        <div>
          <div>Closed Trades: {closedTradesNumber}</div>
          <div>Profit: {profit}</div>
          <div>Last month: {profitLastMonth}</div>
          <div>This month: {profitThisMonth}</div>
          <div>Today: {profitToday}</div>
        </div>
        <div>
          <div>Open Trades: {openTradesNumber}</div>
          <div>Volume: {openVolume}</div>
          <div>Stop Loss Volume: {openStopLossVolume}</div>
        </div>
      </div>
    )
  }
}

export default TradesTotals;