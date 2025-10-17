import React, { createContext, useState, useContext, ReactNode } from 'react';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  notify: (message: string, options?: { type?: NotificationType; duration?: number }) => void;
  remove: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = (message: string, options: { type?: NotificationType; duration?: number } = {}) => {
    const { type = 'info', duration = 4000 } = options;
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type, duration }]);
  };

  const remove = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, notify, remove }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifier = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifier must be used within a NotificationProvider');
  }
  return context;
};