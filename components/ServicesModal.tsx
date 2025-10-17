import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandingIcon, FilmIcon, LogoIcon, PhotoIcon, PrintIcon, SocialMediaIcon, ThumbnailIcon, WebBannerIcon, YouTubeIcon, PromoAdIcon } from './Icons';

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const allGraphicServices = [
  { 
    icon: PhotoIcon, 
    title: 'Photo Manipulation',
    description: 'High-end compositing and creative retouching to turn concepts into stunning visual art.' 
  },
  { 
    icon: ThumbnailIcon, 
    title: 'High-CTR Thumbnails',
    description: 'Designing click-worthy thumbnails optimized for YouTube and social media platforms.' 
  },
  {
    icon: LogoIcon,
    title: 'Logo Design',
    description: 'Crafting unique and memorable logos that represent your brand identity and values.'
  },
  {
    icon: BrandingIcon,
    title: 'Brand Identity',
    description: 'Developing complete visual identities, including color palettes, typography, and brand guidelines.'
  },
  {
    icon: SocialMediaIcon,
    title: 'Social Media Posts',
    description: 'Creating engaging and visually consistent graphics for all your social media channels.'
  },
  {
    icon: PrintIcon,
    title: 'Posters & Flyers',
    description: 'Designing eye-catching print materials for events, promotions, and marketing campaigns.'
  },
  {
    icon: WebBannerIcon,
    title: 'Web Banners & Ads',
    description: 'Creating professional banners and advertisements for websites and online campaigns.'
  }
];

const allVideoServices = [
    { 
        icon: FilmIcon, 
        title: 'VFX & Motion Graphics',
        description: 'Cinematic visual effects, intros, and stylized motion transitions to elevate video content.' 
    },
    {
        icon: YouTubeIcon,
        title: 'YouTube Video Editing',
        description: 'Full-service editing for YouTube content, including trimming, color grading, audio enhancement, and adding engaging graphics.'
    },
    {
        icon: PromoAdIcon,
        title: 'Promotional Video Ads',
        description: 'Creating short, impactful video ads for social media and marketing campaigns that capture attention and drive conversions.'
    }
]

const specialGraphicServices = ['Photo Manipulation', 'High-CTR Thumbnails'];
const specialVideoServices = ['VFX & Motion Graphics'];


const ServicesModal: React.FC<ServicesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'graphics' | 'video'>('graphics');

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2 } },
  };

   const gridVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: { staggerChildren: 0.05 } 
    },
    exit: { opacity: 0 }
  };

   const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  
  const services = activeTab === 'graphics' ? allGraphicServices : allVideoServices;
  const specialServices = activeTab === 'graphics' ? specialGraphicServices : specialVideoServices;

  const handleClose = () => {
    onClose();
  };

  const handleTabChange = (tab: 'graphics' | 'video') => {
    setActiveTab(tab);
  }

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
          aria-labelledby="services-modal-title"
        >
          <motion.div
            className="relative w-full max-w-4xl h-full max-h-[90vh] bg-slate-950/90 border border-slate-800 rounded-lg flex flex-col"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-shrink-0 p-4 sm:p-6 flex items-center justify-between border-b border-slate-700/50">
              <h3 id="services-modal-title" className="text-2xl font-bold text-white">
                My <span className="text-[#E34234]">Services</span>
              </h3>
              <motion.button
                onClick={handleClose}
                className="text-slate-400 hover:text-white text-4xl leading-none transition-colors"
                aria-label="Close services modal"
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                &times;
              </motion.button>
            </div>
             <div className="flex-shrink-0 p-4 border-b border-slate-800/50">
                <div role="tablist" aria-label="Service categories" className="flex items-center justify-center gap-4">
                    <motion.button 
                        id="services-tab-graphics"
                        role="tab"
                        aria-selected={activeTab === 'graphics'}
                        aria-controls="services-tabpanel-graphics"
                        onClick={() => handleTabChange('graphics')}
                        className={`relative font-medium px-4 py-2 rounded-md transition-colors ${activeTab === 'graphics' ? 'text-white' : 'text-slate-400 hover:text-white'} focus:outline-none focus-visible:ring-2 focus-visible:ring-white`}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Graphic Design
                        {activeTab === 'graphics' && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E34234]" layoutId="underline" aria-hidden="true" />}
                    </motion.button>
                     <motion.button 
                        id="services-tab-video"
                        role="tab"
                        aria-selected={activeTab === 'video'}
                        aria-controls="services-tabpanel-video"
                        onClick={() => handleTabChange('video')}
                        className={`relative font-medium px-4 py-2 rounded-md transition-colors ${activeTab === 'video' ? 'text-white' : 'text-slate-400 hover:text-white'} focus:outline-none focus-visible:ring-2 focus-visible:ring-white`}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Video Editing
                        {activeTab === 'video' && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E34234]" layoutId="underline" aria-hidden="true" />}
                    </motion.button>
                </div>
            </div>
            <div className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        id={activeTab === 'graphics' ? 'services-tabpanel-graphics' : 'services-tabpanel-video'}
                        role="tabpanel"
                        aria-labelledby={activeTab === 'graphics' ? 'services-tab-graphics' : 'services-tab-video'}
                        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={gridVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        tabIndex={0}
                    >
                        {services.map((item, index) => {
                        const isSpecial = specialServices.includes(item.title);
                        return (
                            <motion.div
                            key={item.title}
                            className={`relative bg-slate-900/50 p-6 rounded-lg border 
                                        ${isSpecial ? 'border-[#E34234]/60 shadow-[0_0_15px_rgba(227,66,52,0.2)]' : 'border-slate-800'}
                                        hover:border-[#E34234]/50 hover:bg-slate-900
                                        transition-all duration-300 group text-center`}
                            variants={itemVariants}
                            >
                            {isSpecial && (
                                <div className="absolute top-2 right-2 bg-[#E34234]/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Specialty
                                </div>
                            )}
                            <div className="text-[#E34234] mb-3 inline-block transition-transform duration-300 group-hover:scale-110">
                                <item.icon className="w-10 h-10" />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                            <p className="text-sm text-slate-400">
                                {item.description}
                            </p>
                            </motion.div>
                        )
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServicesModal;