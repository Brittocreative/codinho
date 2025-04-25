import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TypingAnimationProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  text,
  speed = 40,
  className = '',
  onComplete
}) => {
  const [displayedText, setDisplayedText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isComplete, setIsComplete] = React.useState(false);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      setIsComplete(true);
      if (onComplete) onComplete();
    }
  }, [currentIndex, text, speed, isComplete, onComplete]);

  // Reset animation when text changes
  React.useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  // Character animation variants
  const characterVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.1 }
    }
  };

  return (
    <div className={`font-medium ${className}`}>
      <AnimatePresence mode="wait">
        {displayedText.split('').map((char, index) => (
          <motion.span
            key={index}
            variants={characterVariants}
            initial="hidden"
            animate="visible"
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </AnimatePresence>
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block ml-1"
        >
          |
        </motion.span>
      )}
    </div>
  );
};

export default TypingAnimation;
