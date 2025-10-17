import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContentLoaderProps {
  type: 'iframe' | 'image';
  src: string;
}

const ContentLoader: React.FC<ContentLoaderProps> = ({ type, src }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Reset state on src change
    setIsLoaded(false);
    setLoadProgress(0);

    // Start simulating progress
    intervalRef.current = setInterval(() => {
      setLoadProgress(prev => {
        if (prev >= 95) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 95; // Cap at 95 until loaded
        }
        // Make progress a bit more random
        const increment = Math.floor(Math.random() * 10) + 1;
        return Math.min(prev + increment, 95);
      });
    }, 250);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [src]);

  const handleLoad = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setLoadProgress(100);
    // Give a brief moment for the user to see 100% before fading out
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  };

  return (
    <motion.div
      className="relative w-full aspect-video bg-slate-900 rounded-lg overflow-hidden shadow-lg border border-slate-800
                 hover:shadow-2xl hover:shadow-[#E34234]/20 hover:border-[#E34234]/50
                 transition-all duration-300 transform group"
      whileHover={{ y: -4, scale: 1.05 }}
    >
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div className="w-full h-full bg-slate-800/80 rounded-lg animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
              <p className="text-2xl text-slate-300 tracking-widest">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={loadProgress}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                  >
                    {loadProgress}
                  </motion.span>
                </AnimatePresence>
                %
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {type === 'iframe' && (
        <iframe
          src={src}
          onLoad={handleLoad}
          onError={handleLoad} // Handle cases where iframe might fail to load
          className={`w-full h-full transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          frameBorder="0"
          allowFullScreen
          scrolling="no"
          title={`Portfolio Content - ${src}`}
        />
      )}

      {type === 'image' && (
        <img
          src={src}
          alt="Portfolio work"
          onLoad={handleLoad}
          onError={handleLoad} // Handle cases where image might fail to load
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </motion.div>
  );
};

export default ContentLoader;