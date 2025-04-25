import React from 'react';
import { motion, useAnimation } from 'framer-motion';

interface FloatingElementProps {
  children: React.ReactNode;
  amplitude?: number;
  duration?: number;
  delay?: number;
  className?: string;
}

const FloatingAnimation: React.FC<FloatingElementProps> = ({
  children,
  amplitude = 10,
  duration = 3,
  delay = 0,
  className = '',
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [`-${amplitude}px`, `${amplitude}px`, `-${amplitude}px`],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: delay,
      }}
    >
      {children}
    </motion.div>
  );
};

export default FloatingAnimation;
