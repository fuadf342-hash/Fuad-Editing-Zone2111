import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RedirectConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectUrl: string;
}

const RedirectConfirmationModal: React.FC<RedirectConfirmationModalProps> = ({ isOpen, onClose, redirectUrl }) => {
  const [view, setView] = useState<'confirm' | 'countdown' | 'thanks'>('confirm');
  const [countdown, setCountdown] = useState(3);
  const countdownInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Reset state when modal opens
    if (isOpen) {
      setView('confirm');
      setCountdown(3);
    } else {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
    }

    return () => {
        if (countdownInterval.current) {
            clearInterval(countdownInterval.current);
        }
    }
  }, [isOpen]);

  const handleConfirm = () => {
    setView('countdown');
    countdownInterval.current = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
  };

  const handleDecline = () => {
    setView('thanks');
    // Show "Thanks" message briefly, then close modal smoothly
    setTimeout(() => {
      onClose();
    }, 1500); // Increased duration for a more graceful message display
  };

  useEffect(() => {
    if (countdown === 0) {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
      window.open(redirectUrl, '_blank', 'noopener,noreferrer');
      onClose();
    }
  }, [countdown, onClose, redirectUrl]);

  const handleClose = () => {
    onClose();
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2 } },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.1 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleClose}
          aria-modal="true"
          role="dialog"
          aria-labelledby="redirect-modal-title"
          aria-describedby="redirect-modal-desc"
        >
          <motion.div
            className="relative w-full max-w-md bg-slate-950/90 border border-slate-800 rounded-lg shadow-2xl shadow-[#E34234]/10 flex flex-col text-center p-6 sm:p-8 overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            style={{ minHeight: '250px' }} // Give it a fixed height to avoid jittering
          >
            <AnimatePresence mode="wait">
              {view === 'confirm' && (
                <motion.div
                  key="confirm"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col items-center justify-center h-full"
                >
                  <h3 id="redirect-modal-title" className="text-2xl font-bold text-white mb-3">
                    External Link
                  </h3>
                  <p id="redirect-modal-desc" className="text-slate-400 mb-8 max-w-sm mx-auto">
                    You will be redirected to his Google Drive portfolio link. Would you like to confirm?
                  </p>
                  <div className="flex gap-4 w-full">
                    <motion.button
                      onClick={handleDecline}
                      className="w-full flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-lg text-base tracking-wider bg-transparent border-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-800 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <i className="fa-solid fa-times" aria-hidden="true"></i> No
                    </motion.button>
                    <motion.button
                      onClick={handleConfirm}
                      className="w-full flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-lg text-base tracking-wider bg-[#E34234] text-white shadow-[0_0_15px_#E34234] hover:shadow-[0_0_25px_#E34234] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <i className="fa-solid fa-check" aria-hidden="true"></i> Yes
                    </motion.button>
                  </div>
                </motion.div>
              )}
              {view === 'countdown' && (
                <motion.div
                  key="countdown"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col items-center justify-center h-full"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <p className="text-slate-400 mb-4">Redirecting in...</p>
                  <div className="text-7xl font-black text-white">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={countdown}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {countdown}
                        </motion.span>
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
              {view === 'thanks' && (
                <motion.div
                  key="thanks-message"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col items-center justify-center h-full w-full"
                  role="status"
                >
                   <motion.div
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 20, delay: 0.1 } }}
                  >
                    <i className="fa-solid fa-check-circle text-5xl text-green-500 mb-4" aria-hidden="true"></i>
                    <h3 className="text-2xl font-bold text-white">
                        Thanks For Browsing!
                    </h3>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RedirectConfirmationModal;