import React, {Component} from 'react';
import {inject} from 'mobx-react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import TradesTable from './Tables/TradesTable';
import TradesStatistics from './TradesTotals';

@inject('trade')
class TradesCard extends Component {
  newTradeClickHandler = () => {
    this.props.trade.setData();
  };

  render() {
    return (
      <Card className="card card--flex">
        <CardHeader title={<Typography variant="title">Trades</Typography>} />
        <CardContent className="trades-card-content">
          <div>
            <Button variant="raised" color="primary" onClick={this.newTradeClickHandler}>New Trade</Button>
          </div>
          <div>
            <TradesStatistics/>
          </div>
          <div>
            <TradesTable />
          </div>
        </CardContent>
      </Card>
    )
  }
}

export default TradesCard;