import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, Variants, AnimatePresence } from 'framer-motion';
import { ThreeDotsIcon, PhotoIcon, ThumbnailIcon, FilmIcon } from './Icons';

interface HeroProps {
  onInViewChange: (isInView: boolean) => void;
  onOpenServicesModal: () => void;
}

const FloatingShape = ({ className, speed = 1 }: { className: string; speed?: number }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 100 * speed]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      aria-hidden="true"
      className={`absolute ${className}`}
      style={{ y: springY }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <div className="w-full h-full bg-gradient-to-br from-[#E34234]/50 to-transparent rounded-full filter blur-2xl"></div>
    </motion.div>
  );
};

const featuredServices = [
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
    icon: FilmIcon,
    title: 'VFX & Motion Graphics',
    description: 'Cinematic visual effects, intros, and stylized motion transitions to elevate video content.' 
  }
];

interface FeaturedServiceProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeaturedService: React.FC<FeaturedServiceProps> = ({ icon: Icon, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
       <motion.button
          className="bg-slate-800/50 hover:bg-slate-700/70 text-slate-300 hover:text-white transition-all duration-300 rounded-full px-4 py-2 text-sm flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E34234]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon className="w-4 h-4 text-[#E34234]" />
          <span>{title}</span>
        </motion.button>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            role="tooltip"
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-slate-800/90 backdrop-blur-sm text-white text-xs rounded-lg p-3 shadow-lg border border-slate-700 pointer-events-none z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {description}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


const Hero: React.FC<HeroProps> = ({ onInViewChange, onOpenServicesModal }) => {
  const [animationStep, setAnimationStep] = useState<'greeting' | 'specialist'>('greeting');
  const { scrollY } = useScroll();
  const scrollArrowOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const smoothScrollArrowOpacity = useSpring(scrollArrowOpacity, { stiffness: 100, damping: 20 });
  
  const ref = React.useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
        setAnimationStep('specialist');
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleScrollDownClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const showcaseElement = document.getElementById('showcase');
    if (showcaseElement) {
      showcaseElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3,
      },
    },
  };

  const greetingContainerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      filter: 'blur(8px)',
      scale: 0.9,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };
  
  const specialistContainerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1.05,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.08,
      },
    },
    exit: { opacity: 0 }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 12 } },
  };
  
  const greetingLine1 = "Assalamu Alaikum I'm";
  const greetingLine2a = "Fuad ";
  const greetingLine2b = "Ahmed";
  const specialistText = "Manipulation, Thumbnail, and VFX Specialist";
  const descriptionBodyText = "I create high-impact visuals that stop the scroll and grow channels. I specialize in results-driven work that delivers measurable engagement.";

  return (
    <motion.section 
      ref={ref} 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center text-center overflow-hidden px-4 pt-32 pb-20"
      onViewportEnter={() => onInViewChange(true)}
      onViewportLeave={() => onInViewChange(false)}
      viewport={{ once: false, amount: 0.5 }}
    >
      <div className="absolute inset-0 z-0">
        <FloatingShape className="top-10 left-10 w-48 h-48" speed={1.5} />
        <FloatingShape className="bottom-20 right-20 w-32 h-32" speed={1.2} />
        <FloatingShape className="top-1/2 left-1/4 w-24 h-24" speed={-1} />
        <FloatingShape className="bottom-1/4 right-1/3 w-40 h-40" speed={-1.3} />
      </div>

      <motion.div
        className="z-10 container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div layout transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}>
            <div className="flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                    {animationStep === 'greeting' ? (
                    <motion.div
                        key="greeting"
                        variants={greetingContainerVariants}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                    >
                        <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white uppercase tracking-tighter">
                            {greetingLine1.split(' ').map((word, wordIndex) => (
                                <span key={wordIndex} className="inline-block whitespace-nowrap mr-3">
                                {word.split('').map((char, charIndex) => (
                                    <motion.span key={charIndex} variants={itemVariants} className="inline-block">{char}</motion.span>
                                ))}
                                </span>
                            ))}
                        </motion.h1>
                        <motion.h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter mt-2">
                            {greetingLine2a.split('').map((char, i) => (
                                <motion.span key={`f-${i}`} variants={itemVariants} className="inline-block">{char}</motion.span>
                            ))}
                            <span className="text-[#E34234]">
                                {greetingLine2b.split('').map((char, i) => (
                                    <motion.span key={`a-${i}`} variants={itemVariants} className="inline-block">{char}</motion.span>
                                ))}
                            </span>
                        </motion.h1>
                    </motion.div>
                    ) : (
                    <motion.div
                        key="specialist"
                        variants={specialistContainerVariants}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                    >
                        <motion.h2 variants={containerVariants} className="text-2xl md:text-4xl font-bold text-slate-100 max-w-3xl mx-auto">
                            {specialistText.split(' ').map((word, index) => (
                                <motion.span key={index} variants={itemVariants} className="inline-block mr-2.5">
                                {word}
                                </motion.span>
                            ))}
                        </motion.h2>
                    </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            <div>
                <motion.div variants={containerVariants}>
                    <motion.p
                    variants={itemVariants}
                    className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto"
                    >
                    {descriptionBodyText.split(" ").map((word, index) => (
                        <motion.span key={index} variants={itemVariants} className="inline-block mr-1.5">
                            {word}
                        </motion.span>
                    ))}
                    </motion.p>
                </motion.div>
                
                <motion.div variants={itemVariants} className="mt-10 flex flex-wrap items-center justify-center gap-4">
                  <motion.a
                    href="https://www.fiverr.com/fuadedits"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#E34234] text-white font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider
                              shadow-[0_0_15px_#E34234] hover:shadow-[0_0_30px_#E34234]
                              transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Fiverr
                  </motion.a>
                  <motion.a
                    href="https://wa.me/8801772723595?text=Hello%20SELECTED%20LEGEND!%20I%20want%20to%20order%20a%20design%20or%20video%20edit.%20Can%20you%20share%20the%20details%3F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-slate-800 text-white font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider
                              hover:bg-[#E34234]
                              transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Order Now
                  </motion.a>
                </motion.div>

                <motion.div 
                    variants={itemVariants} 
                    className="mt-8 flex flex-col items-center justify-center gap-4"
                >
                    <div className="flex items-center justify-center gap-x-4 gap-y-2 flex-wrap">
                        {featuredServices.map(service => (
                            <FeaturedService key={service.title} icon={service.icon} title={service.title} description={service.description} />
                        ))}
                    </div>
                    <motion.button
                        onClick={onOpenServicesModal}
                        className="text-slate-400 hover:text-white transition-colors duration-200 p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E34234]"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="More services"
                    >
                        <ThreeDotsIcon className="w-5 h-5" />
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
      </motion.div>
      
      <motion.div
          className="absolute bottom-20 md:bottom-12 left-1/2 -translate-x-1/2 z-20"
          style={{ opacity: smoothScrollArrowOpacity }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
          <motion.a 
            href="#showcase" 
            aria-label="Scroll to showcase" 
            className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E34234] rounded-full"
            onClick={handleScrollDownClick}
            whileHover={{ scale: 1.1, y: 5 }}
            whileTap={{ scale: 0.9 }}
          >
              <svg aria-hidden="true" className="w-8 h-8 md:w-10 md:h-10 text-[#E34234] drop-shadow-[0_0_10px_#E34234]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
          </motion.a>
      </motion.div>

    </motion.section>
  );
};

export default Hero;