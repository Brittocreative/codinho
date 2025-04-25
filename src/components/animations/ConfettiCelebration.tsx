import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiCelebrationProps {
  isVisible: boolean;
  onComplete?: () => void;
  duration?: number;
  particleCount?: number;
}

const ConfettiCelebration: React.FC<ConfettiCelebrationProps> = ({
  isVisible,
  onComplete,
  duration = 3000,
  particleCount = 50,
}) => {
  const [particles, setParticles] = React.useState<React.ReactNode[]>([]);
  
  React.useEffect(() => {
    if (isVisible) {
      const newParticles = [];
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
      
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 10 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const duration = Math.random() * 2 + 1;
        
        newParticles.push(
          <motion.div
            key={i}
            className="absolute rounded-md"
            style={{
              width: size,
              height: size,
              backgroundColor: color,
              left: `${left}%`,
              top: -20,
            }}
            initial={{ y: -20, rotate: 0, opacity: 1 }}
            animate={{ 
              y: window.innerHeight, 
              rotate: 360, 
              opacity: 0 
            }}
            transition={{ 
              duration: duration, 
              delay: delay,
              ease: "easeOut" 
            }}
          />
        );
      }
      
      setParticles(newParticles);
      
      // Limpar confetes após a duração especificada
      const timer = setTimeout(() => {
        setParticles([]);
        if (onComplete) onComplete();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, particleCount, duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {particles}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfettiCelebration;
