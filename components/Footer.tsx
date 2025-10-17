import React from 'react';
import { motion, Variants } from 'framer-motion';

const Footer: React.FC = () => {
  const wordContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } }
  };

  const wordChild: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 14 } }
  };

  const aboutText = "Hello! I'm Fuad Ahmed, a passionate visual artist from Sylhet, Bangladesh. With over 5 years of experience, I specialize in creating stunning photo manipulations, high-impact YouTube thumbnails, and engaging VFX to bring your vision to life and help you stand out in a crowded digital world.";

  return (
    <motion.footer 
      id="about" 
      className="bg-slate-950 py-12"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-white mb-4"
          variants={wordContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.8 }}
        >
            {"About ".split(' ').map((w,i) => <motion.span variants={wordChild} className="inline-block mr-2" key={i}>{w}</motion.span>)}
            <span className="text-[#E34234]">
                {"Me".split(' ').map((w,i) => <motion.span variants={wordChild} className="inline-block" key={i}>{w}</motion.span>)}
            </span>
        </motion.h2>
        <div className="max-w-3xl mx-auto">
          <motion.p 
            className="text-slate-400"
            variants={wordContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
          >
            {aboutText.split(' ').map((word, i) => (
              <motion.span variants={wordChild} className="inline-block mr-1.5" key={i}>{word}</motion.span>
            ))}
          </motion.p>
        </div>
        <div className="mt-12 text-slate-500">
          <div className="flex items-center justify-center gap-2 mb-4 text-slate-400">
              <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
              <span>Sylhet, Bangladesh</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Fuad Ahmed. All Rights Reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;