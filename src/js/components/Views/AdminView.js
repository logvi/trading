import React, {Component} from 'react';
import {inject} from 'mobx-react';
import Header from '../Header';
import TradesCard from '../TradesCard';
import Loader from '../Loader';
import TradeDialog from '../Dialogs/TradeDialog';

@inject('trades')
class AdminView extends Component {
  componentWillMount() {
    this.props.trades.refresh();
  }

  render() {
    return (
      <div className="app-container">
        <Header/>
        <div className="page-content">
          <TradesCard />
        </div>
        <TradeDialog />
        <Loader/>
      </div>
    )
  }
}

export default AdminView;