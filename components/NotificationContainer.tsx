import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNotifier } from './NotificationProvider';
import { Notification } from './Notification';

export const NotificationContainer: React.FC = () => {
  const { notifications, remove } = useNotifier();

  return (
    <ul className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90vw] max-w-sm space-y-2 z-[200] md:left-auto md:right-4 md:translate-x-0 md:w-full">
      <AnimatePresence initial={false}>
        {notifications.map(n => (
          <Notification key={n.id} notification={n} onRemove={remove} />
        ))}
      </AnimatePresence>
    </ul>
  );
};