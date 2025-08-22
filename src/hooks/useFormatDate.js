import { useSelector } from 'react-redux';
import { format } from 'date-fns';

export const useFormatDate = () => {
  const dateTimeFormat = useSelector((state) => state.dateTime.value);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    try {
      return format(date, dateTimeFormat.dateFormat);
    } catch (error) {
      return date.toLocaleDateString(dateTimeFormat.locale);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    try {
      return format(date, dateTimeFormat.timeFormat);
    } catch (error) {
      return date.toLocaleTimeString(dateTimeFormat.locale);
    }
  };

  return { formatDate, formatTime };
};