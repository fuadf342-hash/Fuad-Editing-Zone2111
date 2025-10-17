import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import BotAvatar from './BotAvatar';
import { ThreeDotsIcon } from './Icons';

interface HeaderProps {
  onOpenContactModal: () => void;
  onTriggerHeroAnimation: () => void;
  onSetShowcaseTab: (tab: string) => void;
}

interface DropdownItem {
  name: string;
  href: string;
  external?: boolean;
  tab?: string | null;
}

const Dropdown = ({ isOpen, items, handleItemClick, id, labelledBy }: {isOpen: boolean, items: DropdownItem[], handleItemClick: any, id: string, labelledBy: string}) => {
    return (
        <AnimatePresence>
            {isOpen && (
            <motion.div
                id={id}
                role="menu"
                aria-labelledby={labelledBy}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-2 w-56 bg-slate-950/80 backdrop-blur-lg border border-slate-700 rounded-lg shadow-2xl shadow-[#E34234]/10"
            >
                <ul className="p-2" role="presentation">
                {items.map(item => (
                    <li key={item.name} role="none">
                    <motion.a
                        href={item.href}
                        target={item.external ? '_blank' : '_self'}
                        rel={item.external ? 'noopener noreferrer' : ''}
                        onClick={(e) => handleItemClick(e, item.href, item.tab, item.external)}
                        className="block px-4 py-2 text-sm text-slate-300 rounded-md hover:bg-[#E34234]/20 hover:text-white transition-colors duration-200 focus:outline-none focus-visible:bg-[#E34234]/20"
                        role="menuitem"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {item.name}
                    </motion.a>
                    </li>
                ))}
                </ul>
            </motion.div>
            )}
        </AnimatePresence>
    );
};


const Header: React.FC<HeaderProps> = ({ onOpenContactModal, onTriggerHeroAnimation, onSetShowcaseTab }) => {
  const [isExpertiseDropdownOpen, setIsExpertiseDropdownOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const controls = useAnimation();
  const expertiseDropdownRef = useRef<HTMLLIElement>(null);
  const aboutDropdownRef = useRef<HTMLLIElement>(null);
  
  useEffect(() => {
    controls.start({ y: 0, transition: { duration: 0.5 } });
  }, [controls]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (expertiseDropdownRef.current && !expertiseDropdownRef.current.contains(event.target as Node)) {
        setIsExpertiseDropdownOpen(false);
      }
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target as Node)) {
        setIsAboutDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems: DropdownItem[] = [
    { name: 'Home', href: '#hero', tab: null },
    { name: 'Contact', href: '#contact', tab: null },
  ];

  const expertiseDropdownItems: DropdownItem[] = [
    { name: 'Graphic Design', href: '#showcase', tab: 'Graphic Design' },
    { name: 'Video Editing', href: '#showcase', tab: 'Video Editing' },
  ];

  const aboutDropdownItems: DropdownItem[] = [
    { name: 'View Full Results on Google', href: 'https://www.google.com/search?q=fuadeditingzone', external: true },
    { name: 'About Me', href: '#about', external: false },
  ];

  const handleNavClick = (e: React.MouseEvent, href: string, tab: string | null = null, isExternal = false) => {
    if (isExternal) {
      setIsAboutDropdownOpen(false);
      setIsExpertiseDropdownOpen(false);
      return;
    }

    e.preventDefault();
    setIsAboutDropdownOpen(false);
    setIsExpertiseDropdownOpen(false);

    setTimeout(() => {
      if (href === '#contact') {
        onOpenContactModal();
      } else {
        if (href === '#hero') {
          onTriggerHeroAnimation();
          controls.start({
            y: [0, -5, 0, 5, 0],
            transition: { duration: 0.4, ease: "easeInOut" }
          });
        }
        
        if (tab) {
          onSetShowcaseTab(tab);
        }

        const targetElement = document.querySelector(href);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 150); 
  };
  
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={controls}
      className="fixed top-0 left-0 right-0 z-[70] bg-slate-950/50 backdrop-blur-lg"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 relative">
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2">
                <BotAvatar size="w-12 h-12" src="https://drive.google.com/file/d/1t5Gs7oR_0Tkbm5qEJddDexIXB0167080/preview" />
                <motion.a
                    href="#hero"
                    onClick={(e) => handleNavClick(e, '#hero')}
                    className="text-2xl font-bold text-white tracking-tighter focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E34234] rounded-md px-2"
                    aria-label="Go to Home section"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Fuad <span className="text-[#E34234]">Editing Zone</span>
                </motion.a>
            </div>
          </div>

          <nav className="hidden md:flex" aria-label="Main navigation">
            <ul className="flex items-center space-x-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <motion.a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href, item.tab)}
                    className="text-slate-300 hover:text-white hover:text-shadow-[0_0_8px_#E34234] transition-all duration-300 px-3 py-2 rounded-md text-sm font-medium tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E34234] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.name}
                  </motion.a>
                </li>
              ))}
              <li className="relative" ref={expertiseDropdownRef}>
                <motion.button
                  id="expertise-button"
                  onClick={() => setIsExpertiseDropdownOpen(prev => !prev)}
                  className="text-slate-300 hover:text-white hover:text-shadow-[0_0_8px_#E34234] transition-all duration-300 px-3 py-2 rounded-md text-sm font-medium tracking-tight flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E34234] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  aria-haspopup="true"
                  aria-expanded={isExpertiseDropdownOpen}
                  aria-controls={isExpertiseDropdownOpen ? 'expertise-dropdown' : undefined}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  My Expertise
                  <svg aria-hidden="true" className={`w-4 h-4 transition-transform duration-200 ${isExpertiseDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </motion.button>
                <Dropdown 
                  id="expertise-dropdown"
                  labelledBy="expertise-button"
                  isOpen={isExpertiseDropdownOpen}
                  items={expertiseDropdownItems}
                  handleItemClick={handleNavClick}
                />
              </li>
               <li className="relative" ref={aboutDropdownRef}>
                <motion.button
                  id="about-button"
                  onClick={() => setIsAboutDropdownOpen(prev => !prev)}
                  className="text-slate-300 hover:text-white hover:text-shadow-[0_0_8px_#E34234] transition-all duration-300 p-2 rounded-full flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E34234] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  aria-label="About and external links"
                  aria-haspopup="true"
                  aria-expanded={isAboutDropdownOpen}
                  aria-controls={isAboutDropdownOpen ? 'about-dropdown' : undefined}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ThreeDotsIcon className="w-5 h-5" />
                </motion.button>
                <Dropdown 
                  id="about-dropdown"
                  labelledBy="about-button"
                  isOpen={isAboutDropdownOpen}
                  items={aboutDropdownItems}
                  handleItemClick={handleNavClick}
                />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;