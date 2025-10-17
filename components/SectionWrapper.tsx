import React from 'react';
import { motion } from 'framer-motion';

interface SectionWrapperProps {
  children: React.ReactNode;
  id: string;
  className?: string;
  noPaddingTop?: boolean;
  onInView?: () => void;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ children, id, className = '', noPaddingTop = false, onInView }) => {
  return (
    <motion.section
      id={id}
      className={`relative py-20 lg:py-28 ${noPaddingTop ? 'pt-0 lg:pt-0' : ''} ${className}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: 'spring', stiffness: 90, damping: 25, mass: 0.8 }}
      onViewportEnter={onInView}
    >
      {children}
    </motion.section>
  );
};

export default SectionWrapper;