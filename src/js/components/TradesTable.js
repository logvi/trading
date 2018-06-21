import React from 'react';
import {observer} from 'mobx-react';
import PropsTypes from 'prop-types';
import {inject} from 'mobx-react';
import DataTable from './DataTable';
import Column from './DataTable/models/Column';
import formatDate from '../utils/formatDate';

const COLUMNS = [
  new Column({
    name: 'ticket',
    title: 'Ticket',
    sortable: true
  }),
  new Column({
    name: 'symbol',
    title: 'Symbol',
    sortable: true
  }),
  new Column({
    name: 'type',
    title: 'Type',
    sortable: true
  }),
  new Column({
    name: 'timeOpen',
    title: 'Open Time',
    sortable: true
  }),
  new Column({
    name: 'priceOpen',
    title: 'Open Price',
    sortable: true
  }),
  new Column({
    name: 'amount',
    title: 'Amount',
    sortable: true
  }),
  new Column({
    name: 'sl',
    title: 'SL',
    sortable: true
  }),
  new Column({
    name: 'tp',
    title: 'TP',
    sortable: true
  }),
  new Column({
    name: 'timeClose',
    title: 'Close Time',
    sortable: true
  }),
  new Column({
    name: 'priceClose',
    title: 'Close Price',
    sortable: true
  }),
  new Column({
    name: 'profit',
    title: 'Profit',
    sortable: true
  }),
];

@inject("trades")
@observer
class TradesTable extends React.Component {
  static propTypes = {
    trades: PropsTypes.object
  };

  onTableAction = (action, params) => {
    switch(action) {
      case 'sort':
        if (this.props.trades.isLoading) return;
        this.props.trades.setOrderBy({[params.column.name]:params.orderBy});
        break;
      default:
        break;
    }
  };

  render() {
    const {data, isLoading, orderBy} = this.props.trades;
    return (
      <DataTable
        className="trades-table"
        columns={COLUMNS}
        data={data}
        loading={isLoading}
        onAction={this.onTableAction}
        orderBy={orderBy}
        stripped
      />
    );
  }
}

export default TradesTable;