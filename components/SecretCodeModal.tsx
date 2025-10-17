import React, { useState, useEffect, FormEvent, forwardRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface SecretCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onFailure: () => void;
  attemptsLeft: number;
}

const stepsConfig = [
    {
      step: 1,
      title: "Enter Special Code",
      prompt: "Please select the correct date to proceed.",
      type: 'date',
      correctValue: '09/09/2006'
    },
    {
      step: 2,
      title: "Identity Verification",
      prompt: "Enter Your Name",
      type: 'password',
      correctValue: 'jiya'
    },
    {
      step: 3,
      title: "Enter Special Code",
      prompt: "Please select the correct date to proceed.",
      type: 'date',
      correctValue: '23/07/2003'
    }
];

const SecretCodeModal = forwardRef<HTMLDivElement, SecretCodeModalProps>(({ isOpen, onClose, onSuccess, onFailure, attemptsLeft }, ref) => {
  const [step, setStep] = useState(1);
  const [textValue, setTextValue] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const currentStep = stepsConfig.find(s => s.step === step);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setTextValue('');
      setDay('');
      setMonth('');
      setYear('');
      setError('');
    }
  }, [isOpen]);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!currentStep) return;

    let isCorrect = false;
    
    if (currentStep.type === 'date') {
      const formattedDate = `${day}/${month}/${year}`;
      isCorrect = formattedDate === currentStep.correctValue;
    } else {
      isCorrect = textValue.trim().toLowerCase() === currentStep.correctValue;
    }

    if (isCorrect) {
      setError('');
      if (step < 3) {
        setStep(s => s + 1);
        setTextValue('');
        setDay('');
        setMonth('');
        setYear('');
      } else {
        onSuccess();
      }
    } else {
      setError(`Access Denied. ${attemptsLeft - 1 > 0 ? `${attemptsLeft - 1} attempts remaining.` : 'Last attempt.'}`);
      triggerShake();
      onFailure();
      setTextValue('');
      setDay('');
      setMonth('');
      setYear('');
    }
  };

  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2 } },
  };

  const stepVariants: Variants = {
    hidden: { opacity: 0, x: 50, position: 'absolute' },
    visible: { opacity: 1, x: 0, position: 'relative' },
    exit: { opacity: 0, x: -50, position: 'absolute' }
  };
  
  const shakeAnimation = {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 }
  };
  
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 101 }, (_, i) => currentYear - i);

  const selectWrapperClasses = "relative w-full";
  const selectClasses = "w-full h-12 px-4 pr-10 bg-slate-800 text-white rounded-md border border-slate-600 hover:border-slate-500 focus:border-[#E34234] focus:ring-1 focus:ring-[#E34234] focus:outline-none transition-colors appearance-none";
  const lockedButtonClasses = "w-full h-12 px-4 flex items-center justify-center bg-slate-800 text-slate-400 font-bold rounded-md border border-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-all hover:border-slate-500";
  const chevronIcon = (
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
      <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
    </div>
  );

  const renderSelectOrLocked = (
    value: string, 
    setValue: React.Dispatch<React.SetStateAction<string>>, 
    placeholder: string, 
    options: (string | number)[]
  ) => (
    <div className={`${selectWrapperClasses} h-12`}>
        <AnimatePresence mode="wait">
            {value ? (
                <motion.button
                    key="locked"
                    type="button"
                    onClick={() => setValue('')}
                    className={lockedButtonClasses}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                >
                    <i className="fa-solid fa-lock text-sm"></i>
                </motion.button>
            ) : (
                <motion.div
                    key="select"
                    className="relative w-full h-full"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                >
                    <select value={value} onChange={e => setValue(e.target.value)} required className={selectClasses}>
                        <option value="" disabled>{placeholder}</option>
                        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    {chevronIcon}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
          aria-labelledby="secret-code-title"
        >
          <motion.div
            ref={ref}
            className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-[#E34234]/20 flex flex-col text-center p-6 sm:p-8 overflow-hidden"
            variants={modalVariants}
            animate={isShaking ? shakeAnimation : {}}
            onClick={(e) => e.stopPropagation()}
            style={{ minHeight: '350px' }}
          >
            <motion.button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-4 text-slate-500 hover:text-white transition-colors z-10"
              aria-label="Close"
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <i className="fa-solid fa-times text-xl"></i>
            </motion.button>
            <AnimatePresence mode="wait">
              {currentStep && (
                <motion.div
                  key={step}
                  className="w-full"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <h3 id="secret-code-title" className="text-2xl font-bold text-white mb-2">
                     {currentStep.title === 'Enter Special Code' ? (
                        <>Enter <span className="text-[#E34234]">Special Code</span></>
                     ) : (
                        currentStep.title
                     )}
                  </h3>
                  <p className="text-slate-400 mb-8">{currentStep.prompt}</p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {currentStep.type === 'date' ? (
                        <div className="flex gap-3">
                            {renderSelectOrLocked(day, setDay, 'Day', days)}
                            {renderSelectOrLocked(month, setMonth, 'Month', months)}
                            {renderSelectOrLocked(year, setYear, 'Year', years)}
                        </div>
                    ) : (
                      <input
                        type="password"
                        value={textValue}
                        onChange={e => setTextValue(e.target.value)}
                        required
                        autoFocus
                        className="h-12 w-full px-4 py-2 bg-slate-800 text-white rounded-md border border-slate-600 focus:border-[#E34234] focus:ring-1 focus:ring-[#E34234] focus:outline-none transition-colors text-center"
                      />
                    )}
                    
                    <AnimatePresence>
                        {error && (
                            <motion.p 
                                role="alert" 
                                className="text-red-400 text-sm font-semibold"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                {error}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    <motion.button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-lg text-base tracking-wider bg-[#E34234] text-white shadow-[0_0_15px_#E34234] hover:shadow-[0_0_25px_#E34234] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:bg-slate-600 disabled:shadow-none disabled:text-slate-400"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={currentStep.type === 'date' ? (!day || !month || !year) : !textValue}
                    >
                      <i className="fa-solid fa-lock mr-1 text-sm"></i>Unlock
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default SecretCodeModal;