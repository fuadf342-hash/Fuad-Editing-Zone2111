import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import SectionWrapper from './SectionWrapper';
import ContentLoader from './ContentLoader';
import ParallaxWrapper from './ParallaxWrapper';
import RedirectConfirmationModal from './RedirectConfirmationModal';

// --- Props Interface ---
interface ShowcaseProps {
  isReady?: boolean;
  activeMainTab: string;
  onMainTabChange: (tab: string) => void;
}

// --- Data for the Showcase ---

// Behance projects for Photo Manipulation
const photoManipulationContent = [
  'https://www.behance.net/embed/project/235873941?ilo0=1',
  'https://www.behance.net/embed/project/230653607?ilo0=1',
  'https://www.behance.net/embed/project/229320593?ilo0=1',
  'https://www.behance.net/embed/project/229321481?ilo0=1',
  'https://www.behance.net/embed/project/229366783?ilo0=1',
];

// YouTube Thumbnails from Google Drive
const youtubeThumbnailsContent = [
  'https://drive.google.com/file/d/1BnCEa8dHwkFmiWwIVskuzI4UaFx03QRA/preview',
  'https://drive.google.com/file/d/1afTviHa9lkgK1u9U75q0F1VFK5W6rQvB/preview',
  'https://drive.google.com/file/d/1uVsrU_M8UqD2l2upHVc88A4pJ_Xcdeih/preview',
  'https://drive.google.com/file/d/1gQN4sG3yv0yGJEJlj1luAS5Bi3Z9bkdU/preview',
  'https://drive.google.com/file/d/1uHLa1DHSxTCaQ25FNlzu5rU26EtN0qJX/preview',
  'https://drive.google.com/file/d/1b22qQVSyAJiOwZojco14WsrVNawRoTo0/preview',
];

// Banner Designs from Google Drive
const bannerDesignsContent = [
  'https://drive.google.com/file/d/1yQGYeZC9TqOQjrGMviHOJw-RsnSmLhxO/preview',
  'https://drive.google.com/file/d/1ntbvc3WEfKEBbJFHvj0xE9P4JuQ2Z7DS/preview',
  'https://drive.google.com/file/d/14zOs-XFjjfWfi_OxaKgqdOQZGclNrQmP/preview',
  'https://drive.google.com/file/d/1bPxxoRxOcPQctjnewgiFiT7fZ7paX-UM/preview',
  'https://drive.google.com/file/d/1PXd-cFqu-wtDgLpBYR7Ug5YZ0Vv6x0Tj/preview',
  'https://drive.google.com/file/d/1-a5hbxIYzECPvO7s2ygFZltuBSxN8hn5/preview',
];

const graphicDesignData = {
  'Photo Manipulation / Social Media Posts': { type: 'iframe' as const, items: photoManipulationContent, description: '' },
  'YouTube Thumbnails': { type: 'iframe' as const, items: youtubeThumbnailsContent, description: '' },
  'Banner Designs': { type: 'iframe' as const, items: bannerDesignsContent, description: '' },
};

const videoEditingContent = {
  'Anime / AMV Edits': {
    type: 'iframe' as const,
    items: [
      'https://www.youtube.com/embed/oAEDU-nycsE',
      'https://www.youtube.com/embed/GiHZJkUvv6o',
      'https://www.youtube.com/embed/F-0ATxAccEI',
      'https://www.youtube.com/embed/4YWUaCQkUL0',
      'https://www.youtube.com/embed/w9mP_wz1NXE',
      'https://www.youtube.com/embed/ZktEBficiy0',
      'https://www.youtube.com/embed/U4ge4NqBFAM',
      'https://www.youtube.com/embed/K0xSOSvjsXU',
    ],
    description: "Created 300+ video edits since 2020 to 2025. Expert in making high quality transitions edits."
  },
  'VFX Edits (Premium)': {
    type: 'iframe' as const,
    items: [
      'https://www.tiktok.com/embed/7501821020492418312',
      'https://www.tiktok.com/embed/7515664349592161544',
      'https://www.tiktok.com/embed/7526208727800859911',
      'https://www.tiktok.com/embed/7515507775556898056',
      'https://www.tiktok.com/embed/7533648173055905032',
    ],
    description: "One of the famous short VFX editor in Bangladesh with millions of views."
  }
};

const mainTabs = ['Graphic Design', 'Video Editing'];
const graphicDesignSubTabs = Object.keys(graphicDesignData);
const videoEditingSubTabs = Object.keys(videoEditingContent);
const premiumGraphicSubTabs = graphicDesignSubTabs.slice(0, 3);
const premiumVideoSubTabs = ['VFX Edits (Premium)'];
const whatsappOrderLink = "https://wa.me/8801772723595?text=Hello%20Fuad!%20I%20saw%20your%20work%20and%20I'm%20interested%20in%20placing%20an%20order.";
const googleDriveLink = "https://drive.google.com/drive/folders/1YLOxrvNTjUdOfWZL7nJmhPt4qlOl3VM_?usp=sharing";


const Showcase: React.FC<ShowcaseProps> = ({ isReady = false, activeMainTab, onMainTabChange }) => {
  const [activeSubTab, setActiveSubTab] = useState(graphicDesignSubTabs[0]);
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false);
  const titleControls = useAnimation();
  const [hasTitleAnimated, setHasTitleAnimated] = useState(false);

  useEffect(() => {
    if (activeMainTab === 'Graphic Design') {
      setActiveSubTab(graphicDesignSubTabs[0]);
    } else if (activeMainTab === 'Video Editing') {
      setActiveSubTab(videoEditingSubTabs[0]);
    }
  }, [activeMainTab]);

  useEffect(() => {
    if (isReady && !hasTitleAnimated) {
      titleControls.start({ opacity: 1, y: 0 });
      setHasTitleAnimated(true);
    }
  }, [isReady, titleControls, hasTitleAnimated]);

  const handleViewportEnter = () => {
    if (!hasTitleAnimated) {
      titleControls.start({ opacity: 1, y: 0 });
      setHasTitleAnimated(true);
    }
  };
  
  const currentSubTabs = activeMainTab === 'Graphic Design' ? graphicDesignSubTabs : videoEditingSubTabs;
  
  const validSubTab = currentSubTabs.includes(activeSubTab) ? activeSubTab : currentSubTabs[0];
  
  const currentContent = activeMainTab === 'Graphic Design'
    ? graphicDesignData[validSubTab as keyof typeof graphicDesignData]
    : videoEditingContent[validSubTab as keyof typeof videoEditingContent];


  const handleMainTabClick = (tab: string) => {
    if (tab !== activeMainTab) {
        onMainTabChange(tab);
    }
  };
  
  const handleSubTabClick = (tab: string) => {
    if (tab !== activeSubTab) {
        setActiveSubTab(tab);
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.08 }
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };
  
  return (
    <SectionWrapper id="showcase" noPaddingTop onInView={handleViewportEnter}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-white mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={titleControls}
          onViewportEnter={handleViewportEnter}
          transition={{ duration: 0.5 }}
        >
          Work <span className="text-[#E34234]">Showcase</span>
        </motion.h2>

        {/* Main Tabs */}
        <div 
          role="tablist"
          aria-label="Service categories"
          className="flex justify-center items-center gap-2 md:gap-4 p-1 bg-slate-900/50 rounded-full max-w-md mx-auto mb-8"
        >
          {mainTabs.map(tab => (
            <motion.button
              key={tab}
              id={`main-tab-${tab.replace(/\s+/g, '-')}`}
              role="tab"
              aria-selected={activeMainTab === tab}
              aria-controls={`main-tabpanel-${tab.replace(/\s+/g, '-')}`}
              onClick={() => handleMainTabClick(tab)}
              className={`w-full font-bold py-2 px-4 rounded-full text-sm md:text-base transition-colors duration-300 relative ${
                activeMainTab === tab ? 'text-white' : 'text-slate-300 hover:text-white'
              } focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E34234] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeMainTab === tab && (
                <motion.div
                  layoutId="mainTabHighlight"
                  className="absolute inset-0 bg-[#E34234] rounded-full shadow-[0_0_15px_#E34234]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  aria-hidden="true"
                />
              )}
              <span className="relative z-10">{tab}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
            <motion.div
                key={activeMainTab}
                id={`main-tabpanel-${activeMainTab.replace(/\s+/g, '-')}`}
                role="tabpanel"
                aria-labelledby={`main-tab-${activeMainTab.replace(/\s+/g, '-')}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                tabIndex={0}
            >
                {activeMainTab === 'Graphic Design' && (
                     <>
                        {/* Sub Tabs for Graphic Design */}
                        <div 
                          role="tablist"
                          aria-label="Graphic design categories"
                          className="flex justify-center flex-wrap gap-2 md:gap-4 mb-12"
                        >
                            {graphicDesignSubTabs.map(tab => {
                                const isPremium = premiumGraphicSubTabs.includes(tab);
                                return (
                                    <motion.button
                                      key={tab}
                                      id={`sub-tab-gd-${tab.replace(/[\s/]+/g, '-')}`}
                                      role="tab"
                                      aria-selected={activeSubTab === tab}
                                      aria-controls="sub-tabpanel-gd"
                                      onClick={() => handleSubTabClick(tab)}
                                      className={`relative font-medium py-2 px-5 rounded-md text-xs md:text-sm transition-all duration-300 border-2 ${
                                          activeSubTab === tab 
                                          ? 'bg-[#E34234] border-[#E34234] text-white shadow-[0_0_10px_#E34234]' 
                                          : 'bg-transparent border-slate-700 text-slate-300 hover:border-[#E34234]/50 hover:text-white'
                                      } focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E34234] focus-visible:ring-offset-1 focus-visible:ring-offset-slate-900`}
                                      whileHover={{ scale: 1.05, y: -2 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      {tab}
                                      {isPremium && <div aria-hidden="true" className="absolute top-0 right-0 -mt-1 -mr-1 w-3 h-3 rounded-full bg-[#E34234] animate-pulse"></div>}
                                    </motion.button>
                                )
                            })}
                            <motion.button
                                onClick={() => setIsRedirectModalOpen(true)}
                                className="font-medium py-2 px-5 rounded-md text-xs md:text-sm transition-all duration-300 bg-slate-800 text-slate-300 hover:bg-[#E34234] hover:text-white hover:shadow-[0_0_10px_#E34234] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E34234] focus-visible:ring-offset-1 focus-visible:ring-offset-slate-900"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                More <i className="fa-solid fa-arrow-up-right-from-square ml-1.5 text-xs opacity-80" aria-hidden="true"></i>
                            </motion.button>
                        </div>

                        {/* Content Grid */}
                        <AnimatePresence mode="wait">
                        <motion.div
                            key={validSubTab}
                            id="sub-tabpanel-gd"
                            role="tabpanel"
                            aria-labelledby={`sub-tab-gd-${validSubTab.replace(/[\s/]+/g, '-')}`}
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            tabIndex={0}
                        >
                            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {currentContent.items.map((src, index) => (
                                    <ParallaxWrapper key={`${validSubTab}-${index}`} tiltAmount={5}>
                                        <motion.div variants={contentVariants} className="relative">
                                            <ContentLoader 
                                                type={currentContent.type} 
                                                src={src} 
                                            />
                                            {index === 0 && (
                                                <motion.a
                                                    href={whatsappOrderLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-[#E34234] text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg shadow-[#E34234]/30"
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{
                                                        opacity: 1,
                                                        scale: [1, 1.05, 1],
                                                        transition: {
                                                            delay: 1,
                                                            duration: 2,
                                                            repeat: Infinity,
                                                            repeatType: 'reverse',
                                                            ease: 'easeInOut'
                                                        }
                                                    }}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <i className="fa-solid fa-plus text-xs" aria-hidden="true"></i>
                                                    Order Now
                                                </motion.a>
                                            )}
                                        </motion.div>
                                    </ParallaxWrapper>
                                ))}
                            </motion.div>
                        </motion.div>
                        </AnimatePresence>
                    </>
                )}
                {activeMainTab === 'Video Editing' && (
                    <>
                        {/* Sub Tabs for Video Editing */}
                        <div 
                          role="tablist"
                          aria-label="Video editing categories"
                          className="flex justify-center flex-wrap gap-2 md:gap-4 mb-12"
                        >
                            {videoEditingSubTabs.map(tab => {
                                const isPremium = premiumVideoSubTabs.includes(tab);
                                return (
                                    <motion.button
                                      key={tab}
                                      id={`sub-tab-ve-${tab.replace(/[\s/]+/g, '-')}`}
                                      role="tab"
                                      aria-selected={activeSubTab === tab}
                                      aria-controls="sub-tabpanel-ve"
                                      onClick={() => handleSubTabClick(tab)}
                                      className={`relative font-medium py-2 px-5 rounded-md text-xs md:text-sm transition-all duration-300 border-2 ${
                                          activeSubTab === tab 
                                          ? 'bg-[#E34234] border-[#E34234] text-white shadow-[0_0_10px_#E34234]' 
                                          : 'bg-transparent border-slate-700 text-slate-300 hover:border-[#E34234]/50 hover:text-white'
                                      } focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E34234] focus-visible:ring-offset-1 focus-visible:ring-offset-slate-900`}
                                      whileHover={{ scale: 1.05, y: -2 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      {tab}
                                      {isPremium && <div aria-hidden="true" className="absolute top-0 right-0 -mt-1 -mr-1 w-3 h-3 rounded-full bg-[#E34234] animate-pulse"></div>}
                                    </motion.button>
                                )
                            })}
                        </div>

                        {/* Content Grid for Video Editing */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={validSubTab}
                                id="sub-tabpanel-ve"
                                role="tabpanel"
                                aria-labelledby={`sub-tab-ve-${validSubTab.replace(/[\s/]+/g, '-')}`}
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                tabIndex={0}
                            >
                                {currentContent.items.length > 0 ? (
                                    <>
                                        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                            {currentContent.items.map((src, index) => {
                                                const isPopular = (validSubTab === 'Anime / AMV Edits' && index < 2) || (validSubTab === 'VFX Edits (Premium)' && index < 3);
                                                return (
                                                    <ParallaxWrapper key={`${validSubTab}-${index}`} tiltAmount={5}>
                                                        <motion.div variants={contentVariants} className="relative">
                                                            <ContentLoader 
                                                                type={currentContent.type} 
                                                                src={src} 
                                                            />
                                                            {isPopular && (
                                                                <motion.div
                                                                    className="absolute top-2 right-2 z-10 bg-[#E34234] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg shadow-[#E34234]/30"
                                                                    initial={{ scale: 0, opacity: 0, y: 10 }}
                                                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                                                    transition={{ delay: 0.5 + index * 0.1, type: 'spring', stiffness: 400, damping: 15 }}
                                                                >
                                                                    Popular
                                                                </motion.div>
                                                            )}
                                                             {index === 0 && (
                                                                <motion.a
                                                                    href={whatsappOrderLink}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-[#E34234] text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg shadow-[#E34234]/30"
                                                                    initial={{ scale: 0, opacity: 0 }}
                                                                    animate={{
                                                                        opacity: 1,
                                                                        scale: [1, 1.05, 1],
                                                                        transition: {
                                                                            delay: 1,
                                                                            duration: 2,
                                                                            repeat: Infinity,
                                                                            repeatType: 'reverse',
                                                                            ease: 'easeInOut'
                                                                        }
                                                                    }}
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                >
                                                                    <i className="fa-solid fa-plus text-xs" aria-hidden="true"></i>
                                                                    Order Now
                                                                </motion.a>
                                                            )}
                                                        </motion.div>
                                                    </ParallaxWrapper>
                                                )
                                            })}
                                        </motion.div>
                                        {currentContent.description && (
                                            <motion.p 
                                                className="text-slate-400 mt-12 max-w-lg mx-auto"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.3 }}
                                            >
                                                {currentContent.description}
                                            </motion.p>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-20">
                                        <h3 className="text-2xl font-bold text-white mb-2">Coming Soon!</h3>
                                        <p className="text-slate-400">My premium VFX edits are being curated and will be showcased here shortly.</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </>
                )}
            </motion.div>
        </AnimatePresence>
      </div>
       <RedirectConfirmationModal
        isOpen={isRedirectModalOpen}
        onClose={() => setIsRedirectModalOpen(false)}
        redirectUrl={googleDriveLink}
      />
    </SectionWrapper>
  );
};

export default Showcase;