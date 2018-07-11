import React from 'react';
import formatDate from '../../../utils/dateUtils';

function DateTimeColumn(column, row) {
  return <span>{formatDate(row[column.name], {displayTime: true})}</span>;
}

export default DateTimeColumn;