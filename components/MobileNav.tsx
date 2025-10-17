import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileNavProps {
  onOpenContactModal: () => void;
  onTriggerHeroAnimation: () => void;
  onSetShowcaseTab: (tab: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ 
    onOpenContactModal, 
    onTriggerHeroAnimation,
    onSetShowcaseTab,
}) => {
  const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
  
  const navItems = [
    { name: 'Home', icon: 'fa-solid fa-house', action: 'home' },
    { name: 'Graphic', icon: 'fa-solid fa-palette', action: 'graphic' },
    { name: 'Video', icon: 'fa-solid fa-film', action: 'video' },
    { name: 'Contact', icon: 'fa-solid fa-paper-plane', action: 'contact' },
    { name: 'About', icon: 'fa-solid fa-user-circle', action: 'about' },
  ];

  const handleNavClick = (action: string) => {
    if (action === 'about') {
      setIsAboutMenuOpen(true);
      return;
    }

    setTimeout(() => {
        switch (action) {
            case 'home':
                onTriggerHeroAnimation();
                document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'graphic':
                onSetShowcaseTab('Graphic Design');
                document.querySelector('#showcase')?.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'video':
                onSetShowcaseTab('Video Editing');
                document.querySelector('#showcase')?.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'contact':
                onOpenContactModal();
                break;
        }
    }, 150);
  };

  const handleAboutMenuClick = (action: 'scroll' | 'google') => {
    setIsAboutMenuOpen(false);

    if (action === 'scroll') {
      setTimeout(() => {
        document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
      }, 250); // Delay to let menu close animation finish
    }
  };

  return (
    <>
      <AnimatePresence>
        {isAboutMenuOpen && (
          <>
            <motion.div
              className="md:hidden fixed inset-0 z-[65] bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAboutMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="about-menu-button"
              className="md:hidden fixed bottom-16 left-0 right-0 z-[70] p-4"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-2 space-y-2 shadow-2xl shadow-black/30">
                <motion.a
                  href="https://www.google.com/search?q=fuadeditingzone"
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  onClick={() => handleAboutMenuClick('google')}
                  className="flex items-center justify-center gap-2 w-full text-center text-white font-medium py-3 px-4 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E34234]"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <i className="fa-brands fa-google" aria-hidden="true"></i>
                  View Full Results on Google
                </motion.a>
                <motion.button
                  role="menuitem"
                  onClick={() => handleAboutMenuClick('scroll')}
                  className="flex items-center justify-center gap-2 w-full text-center text-white font-medium py-3 px-4 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E34234]"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <i className="fa-solid fa-user" aria-hidden="true"></i>
                  About Me
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.nav 
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-t border-slate-800/70 shadow-[0_-5px_20px_rgba(0,0,0,0.2)]"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 40 }}
      >
        <div className="flex justify-around items-center h-16">
          {navItems.map(item => {
            const isAboutButton = item.action === 'about';
            return (
              <motion.button 
                key={item.name}
                id={isAboutButton ? 'about-menu-button' : undefined}
                aria-haspopup={isAboutButton ? 'true' : undefined}
                aria-expanded={isAboutButton ? isAboutMenuOpen : undefined}
                onClick={() => handleNavClick(item.action)}
                className="flex flex-col items-center justify-center text-slate-400 hover:text-[#E34234] focus:text-[#E34234] transition-colors w-1/5 pt-2 pb-1 focus:outline-none focus-visible:bg-slate-800 rounded-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className={`${item.icon} text-xl`}></i>
                <span className="text-xs mt-1 font-medium tracking-wide">{item.name}</span>
              </motion.button>
            )
          })}
        </div>
      </nav>
    </>
  );
};

export default MobileNav;