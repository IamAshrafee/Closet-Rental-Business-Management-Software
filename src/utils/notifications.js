export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const showNotification = (title, options) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, options);
    notification.onclick = () => {
      window.focus();
    };
    return notification;
  }
};
