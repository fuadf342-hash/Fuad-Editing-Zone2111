import React, { useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Notification as NotificationProps } from './NotificationProvider';

interface Props {
  notification: NotificationProps;
  onRemove: (id: string) => void;
}

const icons: { [key: string]: string } = {
  info: 'fa-solid fa-circle-info',
  success: 'fa-solid fa-check-circle',
  warning: 'fa-solid fa-triangle-exclamation',
  error: 'fa-solid fa-circle-xmark',
};

const borderColors: { [key: string]: string } = {
  info: 'border-blue-500',
  success: 'border-green-500',
  warning: 'border-yellow-500',
  error: 'border-red-500',
};

const DRAG_THRESHOLD = 50;

export const Notification: React.FC<Props> = ({ notification, onRemove }) => {
  useEffect(() => {
    if (notification.duration) {
      const timer = setTimeout(() => {
        onRemove(notification.id);
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification, onRemove]);

  const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > DRAG_THRESHOLD) {
      onRemove(notification.id);
    }
  };
  
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 50, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{
        opacity: 0,
        x: 100,
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={onDragEnd}
      dragElastic={{ left: 0.8, right: 0.8 }}
      className={`relative w-full flex items-start p-4 rounded-lg shadow-2xl shadow-black/30 overflow-hidden bg-slate-900/80 backdrop-blur-sm border-l-4 ${borderColors[notification.type]}`}
    >
      <div className="flex-shrink-0 text-xl mr-3">
        <i className={icons[notification.type]}></i>
      </div>
      <p className="text-sm text-slate-200">{notification.message}</p>
    </motion.li>
  );
};