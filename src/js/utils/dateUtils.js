const locale = 'ru-Ru';

const formatDate = (date, {displayTime = true} = {}) => {
    if (!date) return null;
    if (!(date instanceof Date)) date = new Date(date);
    if (displayTime) return date.toLocaleString(locale);
    return date.toLocaleDateString(locale);
};

function toDatetimeLocal(value) {
  if (!value) return '';
  let
    date = value,
    ten = function (i) {
      return (i < 10 ? '0' : '') + i;
    },
    YYYY = date.getFullYear(),
    MM = ten(date.getMonth() + 1),
    DD = ten(date.getDate()),
    HH = ten(date.getHours()),
    II = ten(date.getMinutes()),
    SS = ten(date.getSeconds())
  ;
  return YYYY + '-' + MM + '-' + DD + 'T' +
    HH + ':' + II + ':' + SS;
}

export default formatDate;
export {
  toDatetimeLocal
};