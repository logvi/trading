function getDateFilter(param) {
  // new Date().toJSON().split('T')[0]+'T00:00:00'
  let now = new Date();
  let dateFrom, dateTo;
  switch (param) {
    case 'today':
      dateFrom = now.toJSON().split('T')[0]+'T00:00:00';
      dateTo = now.toJSON().split('T')[0]+'T23:59:59';
      break;
    case 'thisMonth':
      dateFrom = new Date(now.getFullYear(), now.getMonth(), 1).toJSON().split('T')[0]+'T00:00:00';
      dateTo = now;
      break;
    case 'lastMonth':
      dateFrom = new Date(now.getFullYear(), now.getMonth() - 1, 1).toJSON().split('T')[0]+'T00:00:00';
      dateTo = new Date(now.getFullYear(), now.getMonth(), 0).toJSON().split('T')[0]+'T23:59:59';
      break;
  }
  return {dateFrom, dateTo};
}

exports.getDateFilter = getDateFilter;