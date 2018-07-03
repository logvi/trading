const locale = 'ru-Ru';

const formatDate = (date, {displayTime = false} = {}) => {
    if (!date) return null;
    if (!(date instanceof Date)) date = new Date(date);
    if (displayTime) return date.toLocaleString(locale);
    return date.toLocaleDateString(locale);
};

export default formatDate;