import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, Variants, useScroll, useTransform, useSpring } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Showcase from './components/Showcase';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import ServicesModal from './components/ServicesModal';
import FuadBot from './components/FuadBot';
import MobileNav from './components/MobileNav';
import { NotificationContainer } from './components/NotificationContainer';

// --- Scroll Notification Component ---
interface ScrollNotificationProps {
  isVisible: boolean;
}

const ScrollNotification: React.FC<ScrollNotificationProps> = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] bg-slate-800 text-white py-2 px-5 rounded-full shadow-lg shadow-[#E34234]/20 border border-slate-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <p className="text-sm font-medium">Taking you to the showcase...</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


// --- InactivityReward Component ---
const InactivityReward = ({ isActive, onComplete }: { isActive: boolean, onComplete: () => void }) => {
  type Step = 'intro' | 'counting' | 'congrats';
  const [step, setStep] = useState<Step>('intro');
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) {
        setStep('intro');
        setCount(0);
        return;
    }

    if (step === 'intro') {
      const timer = setTimeout(() => {
        setStep('counting');
      }, 3000);
      return () => clearTimeout(timer);
    }
    if (step === 'counting') {
      if (count < 9) { // Loop 10 times (0-9)
        const timer = setTimeout(() => setCount(c => c + 1), 1500);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => setStep('congrats'), 1500);
        return () => clearTimeout(timer);
      }
    }
    if (step === 'congrats') {
      const timer = setTimeout(onComplete, 4000);
      return () => clearTimeout(timer);
    }
  }, [isActive, step, count, onComplete]);

  const messageVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const getMessageContent = () => {
    switch (step) {
      case 'intro':
        return "Let's get some rewards, instead of wasting our time";
      case 'counting':
        return `Subhan Allah (${count + 1}/10)`;
      case 'congrats':
        return (
          <div className="relative flex items-center justify-center">
             {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                aria-hidden="true"
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                    top: '50%',
                    left: '50%',
                    transformOrigin: 'center',
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [1, 0],
                  scale: 1,
                  x: `${(Math.cos(i * (360/12) * Math.PI/180)) * (60 + Math.random() * 40)}%`,
                  y: `${(Math.sin(i * (360/12) * Math.PI/180)) * (60 + Math.random() * 40)}%`,
                }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.05, ease: 'easeOut' }}
              />
            ))}
            <motion.span
              className="text-green-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 10, delay: 0.2 }}
            >
              Congratulations!
            </motion.span>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center py-8"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 0.8, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <div 
              className="w-full max-w-md text-center"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
                <AnimatePresence mode="wait">
                <motion.div
                    key={step + count}
                    className="text-white text-xl font-semibold"
                    style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)' }}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.4 }}
                >
                    {getMessageContent()}
                </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


const App: React.FC = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [heroAnimationKey, setHeroAnimationKey] = useState(0);
  const [showScrollNotification, setShowScrollNotification] = useState(false);
  const [isShowcaseReady, setIsShowcaseReady] = useState(false);
  const [activeShowcaseTab, setActiveShowcaseTab] = useState('Graphic Design');
  
  // --- Bot Visibility Logic ---
  const [isBotActive, setIsBotActive] = useState(false);
  const hasBotBeenActivated = useRef(false);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // --- Inactivity Logic States ---
  const [isHeroInactivityActive, setIsHeroInactivityActive] = useState(false);
  const isHeroInView = useRef(false);
  
  // --- Parallax Effect ---
  const mainRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end start"]
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const parallaxY1 = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]), springConfig);
  const parallaxY2 = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]), springConfig);

  // --- Inactivity Logic ---
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heroInactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startInactivitySequence = useCallback(() => {
    // This function can be expanded later if needed
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
    }
    inactivityTimer.current = setTimeout(startInactivitySequence, 30000); // 30s inactivity
  }, [startInactivitySequence]);

  const clearHeroInactivityTimer = useCallback(() => {
    if (heroInactivityTimer.current) {
        clearTimeout(heroInactivityTimer.current);
    }
  }, []);

  const startHeroInactivityTimer = useCallback(() => {
    clearHeroInactivityTimer();
    heroInactivityTimer.current = setTimeout(() => {
        setIsHeroInactivityActive(true);
    }, 10000); // 10 seconds
  }, [clearHeroInactivityTimer]);

  const resetHeroInactivityTimer = useCallback(() => {
    clearHeroInactivityTimer();
    startHeroInactivityTimer();
  }, [clearHeroInactivityTimer, startHeroInactivityTimer]);

  const activateBot = useCallback(() => {
    if (hasBotBeenActivated.current) return;
    hasBotBeenActivated.current = true;
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    setIsBotActive(true);
  }, []);
  
  const handleUserActivity = useCallback(() => {
      activateBot();
      resetInactivityTimer();
      if (isHeroInView.current) {
          if(isHeroInactivityActive) {
            setIsHeroInactivityActive(false);
          }
          resetHeroInactivityTimer();
      }
  }, [resetInactivityTimer, resetHeroInactivityTimer, isHeroInactivityActive, activateBot]);
  
  // Bot Activation Effect
  useEffect(() => {
    const handleScroll = () => {
      if (hasBotBeenActivated.current) return;
      
      scrollTimer.current = setTimeout(() => {
        activateBot();
      }, 10000);
    };

    window.addEventListener('scroll', handleScroll, { once: true });
    
    return () => {
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, [activateBot]);


  useEffect(() => {
    const activityEvents: (keyof WindowEventMap)[] = ['mousemove', 'click', 'scroll', 'keydown'];
    handleUserActivity();

    activityEvents.forEach(event => {
        window.addEventListener(event, handleUserActivity);
    });

    return () => {
        activityEvents.forEach(event => {
            window.removeEventListener(event, handleUserActivity);
        });
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
        clearHeroInactivityTimer();
    };
  }, [handleUserActivity, clearHeroInactivityTimer]);
  
  // Auto-scroll logic
  useEffect(() => {
    const scrollTimer = setTimeout(() => {
      setShowScrollNotification(true);

      const actionTimer = setTimeout(() => {
        const showcaseElement = document.getElementById('showcase');
        if (showcaseElement) {
          showcaseElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setShowScrollNotification(false);

          setTimeout(() => {
            setIsShowcaseReady(true);
          }, 800);
        } else {
          setShowScrollNotification(false);
        }
      }, 2000);

      return () => clearTimeout(actionTimer);
    }, 30000);

    return () => clearTimeout(scrollTimer);
  }, []);
  
  const triggerHeroAnimation = () => {
    setHeroAnimationKey(prevKey => prevKey + 1);
  };

  const handleHeroInViewChange = useCallback((inView: boolean) => {
    isHeroInView.current = inView;
    if (inView) {
      resetHeroInactivityTimer();
    } else {
      clearHeroInactivityTimer();
      setIsHeroInactivityActive(false);
    }
  }, [resetHeroInactivityTimer, clearHeroInactivityTimer]);

  const openContactModal = () => {
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
  };
  
  const openServicesModal = () => {
    setIsServicesModalOpen(true);
  };
  
  const closeServicesModal = () => {
    setIsServicesModalOpen(false);
  };

  return (
    <div className="bg-slate-950 text-slate-300 antialiased relative overflow-x-hidden">
      <NotificationContainer />
      <div 
        aria-hidden="true"
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <motion.div 
            className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-gradient-to-br from-[#E34234]/20 to-transparent rounded-full filter blur-3xl animate-pulse"
            style={{ y: parallaxY1, willChange: 'transform' }}
          />
         <motion.div 
            className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] bg-gradient-to-tl from-[#E34234]/10 to-transparent rounded-full filter blur-3xl animate-pulse animation-delay-4000"
            style={{ y: parallaxY2, willChange: 'transform' }}
          />
      </div>

      <Header
        onOpenContactModal={openContactModal}
        onTriggerHeroAnimation={triggerHeroAnimation}
        onSetShowcaseTab={setActiveShowcaseTab}
      />
      <main ref={mainRef}>
        <Hero 
          key={heroAnimationKey} 
          onInViewChange={handleHeroInViewChange}
          onOpenServicesModal={openServicesModal}
        />
        <InactivityReward 
            isActive={isHeroInactivityActive}
            onComplete={() => setIsHeroInactivityActive(false)}
        />
        <Showcase 
          isReady={isShowcaseReady} 
          activeMainTab={activeShowcaseTab}
          onMainTabChange={setActiveShowcaseTab}
        />
        <Contact />
      </main>
      <Footer />
      <ServicesModal isOpen={isServicesModalOpen} onClose={closeServicesModal} />
      <ContactModal isOpen={isContactModalOpen} onClose={closeContactModal} />
      <ScrollNotification isVisible={showScrollNotification} />
      <FuadBot isVisible={isBotActive} />

       <MobileNav
        onOpenContactModal={openContactModal}
        onTriggerHeroAnimation={triggerHeroAnimation}
        onSetShowcaseTab={setActiveShowcaseTab}
      />
    </div>
  );
};

export default App;