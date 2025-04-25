import React from 'react';
import { motion } from 'framer-motion';

interface CodinhoCharacterProps {
  expression?: 'happy' | 'excited' | 'thinking' | 'sad' | 'surprised';
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  className?: string;
}

const CodinhoCharacter: React.FC<CodinhoCharacterProps> = ({
  expression = 'happy',
  size = 'md',
  animate = true,
  className = '',
}) => {
  // Tamanhos baseados na classe
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  // Expressões faciais do Codinho
  const expressions = {
    happy: '(^‿^)',
    excited: '(≧◡≦)',
    thinking: '(・・?)',
    sad: '(╥﹏╥)',
    surprised: '(⊙_⊙)',
  };

  // Animações baseadas na expressão
  const animations = {
    happy: {
      y: [0, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    excited: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, 0, -5, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    thinking: {
      rotate: [0, 5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    sad: {
      y: [0, 3, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    surprised: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.5,
        repeat: 1,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      className={`flex items-center justify-center bg-blue-100 rounded-full ${sizeClasses[size]} ${className}`}
      animate={animate ? animations[expression] : undefined}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <div className="robot-face text-blue-600 font-bold text-center">
        <div className="antenna text-xs">^</div>
        <div className="face text-xl">{expressions[expression]}</div>
        <div className="body text-xs">[__]</div>
      </div>
    </motion.div>
  );
};

export default CodinhoCharacter;
