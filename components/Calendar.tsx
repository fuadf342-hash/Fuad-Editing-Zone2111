import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface CalendarProps {
  isOpen: boolean;
  selectedDate: string | null; // Format: DD/MM/YYYY
  onDateSelect: (date: string) => void;
  onClose: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ isOpen, selectedDate, onDateSelect, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const handlePrevYear = () => setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
  const handleNextYear = () => setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));

  const grid = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push({ day: null, isPadding: true, date: null });
    for (let i = 1; i <= daysInMonth; i++) days.push({ day: i, isPadding: false, date: new Date(year, month, i) });
    return days;
  }, [currentDate]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDateObj = useMemo(() => {
    if (!selectedDate) return null;
    const [d, m, y] = selectedDate.split('/').map(Number);
    return new Date(y, m - 1, d);
  }, [selectedDate]);

  const handleDayClick = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    onDateSelect(`${day}/${month}/${year}`);
  };
  
  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const calendarVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.15, ease: 'easeIn' } }
  };

  return (
    <AnimatePresence>
    {isOpen && (
      <motion.div
        className="absolute inset-0 z-10 flex items-center justify-center bg-black/60"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <motion.div
            className="w-full bg-black/80 backdrop-blur-sm p-3 rounded-lg border border-[#E34234]/30 select-none"
            variants={calendarVariants}
            onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1">
                    <motion.button type="button" onClick={handlePrevYear} className="p-2 rounded-full hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E34234]" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label="Previous Year">
                        <i className="fa-solid fa-angles-left text-xs text-slate-400"></i>
                    </motion.button>
                    <motion.button type="button" onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E34234]" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label="Previous Month">
                        <i className="fa-solid fa-chevron-left text-xs text-slate-400"></i>
                    </motion.button>
                </div>
                <div className="text-center">
                    <span className="font-bold text-sm text-slate-300 tracking-wider">
                        {currentDate.toLocaleString('en-US', { month: 'long' })}
                    </span>
                    <span className="font-bold text-sm text-slate-400 tracking-wider ml-2">
                        {currentDate.getFullYear()}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <motion.button type="button" onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E34234]" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label="Next Month">
                        <i className="fa-solid fa-chevron-right text-xs text-slate-400"></i>
                    </motion.button>
                    <motion.button type="button" onClick={handleNextYear} className="p-2 rounded-full hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E34234]" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label="Next Year">
                        <i className="fa-solid fa-angles-right text-xs text-slate-400"></i>
                    </motion.button>
                </div>
            </div>
          <div className="grid grid-cols-7 gap-y-1 text-center text-xs text-slate-500 mb-1">
            {daysOfWeek.map((day, i) => <div key={i}>{day}</div>)}
          </div>
          <div className="grid grid-cols-7 place-items-center gap-1">
            {grid.map((item, index) => {
              if (item.isPadding || !item.date) return <div key={index} className="w-8 h-8"></div>;

              const isSelected = selectedDateObj && item.date.getTime() === selectedDateObj.getTime();
              const isToday = item.date.getTime() === today.getTime();
              
              return (
                <motion.button
                  key={index}
                  type="button"
                  onClick={() => handleDayClick(item.date!)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-[#E34234]
                    ${isSelected ? 'bg-[#E34234] text-white shadow-[0_0_10px_#E34234]' : ''}
                    ${!isSelected && isToday ? 'border-2 border-dashed border-slate-600 text-slate-300' : ''}
                    ${!isSelected && !isToday ? 'text-slate-400 hover:bg-slate-700' : ''}
                  `}
                  whileHover={{ scale: isSelected ? 1 : 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {item.day}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    )}
    </AnimatePresence>
  );
};

export default Calendar;