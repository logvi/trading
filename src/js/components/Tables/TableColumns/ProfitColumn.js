import React, {Component} from 'react';

class ProfitColumn extends Component {
  componentDidMount() {
    this.markRow();
  }

  componentDidUpdate() {
    this.markRow();
  }

  markRow = () => {
    if (!this.cellNode) return;
    const profit = this.props.row['profit'];
    if (!profit || profit == 0) return;
    const rowNode = this.cellNode.parentNode.parentNode.parentNode;
    rowNode.classList.add(profit > 0 ? 'tr-profit' : 'tr-loss');
  };

  render() {
    const {column, row} = this.props;

    return (
      <span ref={el => this.cellNode = el}>{row[column.name]}</span>
    )
  }
}

export default ProfitColumn;