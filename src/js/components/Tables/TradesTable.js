import React from 'react';
import {observer} from 'mobx-react';
import PropsTypes from 'prop-types';
import {inject} from 'mobx-react';
import DataTable from '../DataTable';
import Column from '../DataTable/models/Column';
import DateTimeColumn from './TableColumns/DateTimeColumn';

const COLUMNS = [
  new Column({
    name: '_id',
    title: '_id',
    visible: false
  }),
  new Column({
    name: 'id',
    title: 'Id',
    sortable: true
  }),
  new Column({
    name: 'symbol',
    title: 'Symbol',
    sortable: true,
    renderer: (column, row) => {
      return row.symbol.symbol;
    }
  }),
  new Column({
    name: 'type',
    title: 'Type',
    sortable: true
  }),
  new Column({
    name: 'timeOpen',
    title: 'Open Time',
    sortable: true,
    renderer: DateTimeColumn
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
    name: 'stopLoss',
    title: 'SL',
    sortable: true
  }),
  new Column({
    name: 'volume',
    title: 'Volume',
    sortable: true
  }),
  new Column({
    name: 'stopLossVolume',
    title: 'SL Volume',
    sortable: true
  }),
  new Column({
    name: 'timeClose',
    title: 'Close Time',
    sortable: true,
    renderer: DateTimeColumn
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

@inject('trades', 'trade')
@observer
class TradesTable extends React.Component {
  static propTypes = {
    trades: PropsTypes.object
  };

  onTableAction = (action, params) => {
    switch(action) {
      case 'rowClick':
        // console.log(params);
        this.props.trade.getTrade(params.row._id);
        break;
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
        showRowHover
      />
    );
  }
}

export default TradesTable;