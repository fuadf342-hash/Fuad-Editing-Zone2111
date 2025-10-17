import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

interface ParallaxWrapperProps {
  children: React.ReactNode;
  className?: string;
  tiltAmount?: number;
}

const ParallaxWrapper: React.FC<ParallaxWrapperProps> = ({ children, className, tiltAmount = 6 }) => {
  const [isDesktop, setIsDesktop] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => setIsDesktop(window.innerWidth >= 1024);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const ref = useRef<HTMLDivElement>(null);

  // Mobile Scroll Effect
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  const rotateXScroll = useTransform(scrollYProgress, [0, 1], [`${tiltAmount}deg`, `-${tiltAmount}deg`]);
  const smoothRotateXScroll = useSpring(rotateXScroll, { stiffness: 200, damping: 40 });
  
  // Desktop Mouse Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${tiltAmount}deg`, `-${tiltAmount}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${tiltAmount}deg`, `${tiltAmount}deg`]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width - 0.5);
    mouseY.set((e.clientY - top) / height - 0.5);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={isDesktop ? handleMouseMove : undefined}
      onMouseLeave={isDesktop ? handleMouseLeave : undefined}
      style={{
        perspective: '1000px',
        rotateX: isDesktop ? rotateX : smoothRotateXScroll,
        rotateY: isDesktop ? rotateY : 0,
        willChange: 'transform',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxWrapper;