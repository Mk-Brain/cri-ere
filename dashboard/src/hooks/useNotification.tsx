import React from "react";

export function useNotifications() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const addNotification = React.useCallback((notification: Notification) => {
    setNotifications((prevNotifications) => [...prevNotifications, notification]);
  }, []);

  const removeNotification = React.useCallback((id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id),
    );
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
  };
}