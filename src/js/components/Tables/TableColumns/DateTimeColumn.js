import React from 'react';
import formatDate from '../../../utils/formatDate';

function DateTimeColumn(column, row) {
  return <span>{formatDate(row[column.name], {displayTime: true})}</span>;
}

export default DateTimeColumn;