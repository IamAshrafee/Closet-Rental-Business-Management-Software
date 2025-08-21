import { useSelector } from 'react-redux';

export const useFormatDate = () => {
  const dateTimeFormat = useSelector((state) => state.dateTime.value);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    switch (dateTimeFormat.dateFormat) {
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'dayMonthYear':
        const currentYear = new Date().getFullYear();
        const shortMonth = date.toLocaleString('default', { month: 'short' });
        if (year === currentYear) {
          return `${date.getDate()} ${shortMonth}`;
        } else {
          return `${date.getDate()} ${shortMonth} ${year}`;
        }
      default:
        return date.toLocaleDateString(dateTimeFormat.locale);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours %= 12;
    hours = hours || 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = `${hours}:${minutes} ${ampm}`;

    switch (dateTimeFormat.timeFormat) {
      case 'hh:mm A':
        return strTime;
      case 'HH:mm':
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      default:
        return date.toLocaleTimeString(dateTimeFormat.locale);
    }
  };

  return { formatDate, formatTime };
};